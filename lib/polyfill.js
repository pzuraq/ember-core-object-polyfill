const fs = require('fs');
const path = require('path');
const replaceBlock = require('./utils/replace-block');
const Filter = require('broccoli-persistent-filter');

class PolyfillFilter extends Filter {
  constructor(inputNode, env) {
    super(inputNode);

    this.createBlock = fs.readFileSync(path.resolve(`lib/vendor/${env}/create.js`), { encoding: 'utf8' }).replace(/\n/g, '');
    this.appendBlock = fs.readFileSync(path.resolve(`lib/vendor/${env}/append.js`), { encoding: 'utf8' }).replace(/\n/g, '');
  }

  processString(content) {
    return replaceBlock(content, `enifed('ember-runtime/system/core_object'`, (moduleBlock) => {
      let numLines = moduleBlock.match(/\n/g).length;

      moduleBlock = replaceBlock(moduleBlock, `function Class() {`, (classBlock) => {
        return replaceBlock(classBlock, `if (initProperties) {`, '')
          .replace(`finishPartial(this, m);`, '')
          .replace(`this.init.apply(this, arguments);`, '')
          .replace(`this[POST_INIT]();`, '')
          .replace(`m.proto = proto;`, '')
          .replace(`(0, _emberMetal.finishChains)(m);`, '')
          .replace(`_emberMetal.finishChains(this);`, '')
          .replace(`(0, _emberMetal.sendEvent)(this, 'init', undefined, undefined, undefined, m);`, '')
          .replace(`_emberMetal.sendEvent(this, 'init');`, '')
      });

      moduleBlock = replaceBlock(moduleBlock, 'create = function () {', this.createBlock);

      moduleBlock = moduleBlock.replace(/}\)$/, this.appendBlock + '})');

      // In order to prevent source maps from becoming completely broken, we make
      // sure the final output has the same number of lines as the input.
      let newNumLines = moduleBlock.match(/\n/g).length;
      let diffNumLines = Math.abs(newNumLines - numLines);

      for (let i = 0; i < diffNumLines; i++) {
        moduleBlock += '\n';
      }

      return moduleBlock;
    });
  }

  getDestFilePath(relativePath) {
    return relativePath.includes('vendor.js') ? relativePath : null;
  }
}

module.exports = PolyfillFilter;
