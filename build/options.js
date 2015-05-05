'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _newStruct = require('new-struct');

var _newStruct2 = _interopRequireDefault(_newStruct);

var Options = _newStruct2['default']({
  New: New,
  after: after,
  source: source,
  watch: watch,
  dest: dest
});

exports['default'] = Options;

function New(obj) {
  return Options({
    _after: obj && obj.after || undefined,
    _source: obj && obj.source || undefined,
    _watch: obj && obj.watch || undefined,
    _dest: obj && obj.dest || undefined
  });
}

function after(options) {
  for (var _len = arguments.length, after = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    after[_key - 1] = arguments[_key];
  }

  options._after = after;
  return options;
}

function source(options) {
  for (var _len2 = arguments.length, source = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    source[_key2 - 1] = arguments[_key2];
  }

  options._source = source;
  return options;
}

function watch(options) {
  for (var _len3 = arguments.length, watch = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    watch[_key3 - 1] = arguments[_key3];
  }

  options._watch = watch;
  return options;
}

function dest(options, dest) {
  options._dest = dest;
  return options;
}
module.exports = exports['default'];