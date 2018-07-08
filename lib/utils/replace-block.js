const OPEN_CHARS = new Set(['{', '[', '(']);
const CLOSE_CHARS = new Set(['}', ']', ')']);

function buildRegex(codeStr) {
  let regexStr = codeStr
    .replace(/ /g, '\\s*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

  return new RegExp(regexStr);
}

module.exports = function replaceBlock(string, begin, callbackOrString) {
  let match = string.match(buildRegex(begin));

  if (match === null) {
    throw new Error(`block not found: ${begin}`);
  }

  let [beginMatch] = match;
  let beginIndex = match.index;
  let blockCount = 0;

  for (let char of begin) {
    if (OPEN_CHARS.has(char)) blockCount++;
    if (CLOSE_CHARS.has(char)) blockCount--;
  }

  if (blockCount <= 0) {
    throw new Error('invalid beginning string, the beginning match must contain more opening chars than closing chars')
  }

  let endIndex = null;

  for (let i = beginIndex + beginMatch.length; i < string.length; i++) {
    if (OPEN_CHARS.has(string[i])) blockCount++;
    if (CLOSE_CHARS.has(string[i])) blockCount--;

    if (blockCount === 0) {
      endIndex = i + 1;
      break;
    }
  }

  if (endIndex === null) {
    throw new Error('end of block not found');
  }

  let before = string.slice(0, beginIndex);
  let block = string.slice(beginIndex, endIndex);
  let after = string.slice(endIndex, string.length);

  let middle = typeof callbackOrString === 'function' ? callbackOrString(block) : callbackOrString;

  return before + middle + after;
}
