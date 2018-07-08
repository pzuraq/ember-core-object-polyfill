'use strict';

function isProductionEnv() {
  const isProd = /production/.test(process.env.EMBER_ENV);
  const isTest = process.env.EMBER_CLI_TEST_COMMAND;

  return isProd && !isTest;
}

module.exports = {
  name: 'ember-core-object-polyfill',

  postprocessTree(type, tree) {
    if (type === 'all') {
      let PolyfillFilter = require('./lib/polyfill');
      return new PolyfillFilter(tree, isProductionEnv() ? 'prod' : 'debug');
    }

    return tree;
  }
};
