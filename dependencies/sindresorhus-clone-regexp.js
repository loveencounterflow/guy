
// thx to https://github.com/sindresorhus/clone-regexp/blob/main/index.js

const flagMap = {
  global: 'g',
  ignoreCase: 'i',
  multiline: 'm',
  dotAll: 's',
  sticky: 'y',
  unicode: 'u'
};

exports.cloneRegExp = function cloneRegExp(regexp, options = {}) {
  // if (!isRegexp(regexp)) {
  //   throw new TypeError('Expected a RegExp instance');
  // }

  const flags = Object.keys(flagMap).map(flag => (
    (typeof options[flag] === 'boolean' ? options[flag] : regexp[flag]) ? flagMap[flag] : ''
  )).join('');

  const clonedRegexp = new RegExp(options.source || regexp.source, flags);

  clonedRegexp.lastIndex = typeof options.lastIndex === 'number' ?
    options.lastIndex :
    regexp.lastIndex;

  return clonedRegexp;
}