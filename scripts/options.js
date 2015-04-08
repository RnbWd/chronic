'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Struct = require('new-struct');

var _Struct2 = _interopRequireWildcard(_Struct);

var Options = _Struct2['default']({
  New: New,
  after: after,
  source: source,
  watch: watch,
  dest: dest,
  transform: transform
});

exports['default'] = Options;

function New(obj) {
  return Options({
    _after: obj && obj.after || undefined,
    _source: obj && obj.source || undefined,
    _watch: obj && obj.watch || undefined,
    _dest: obj && obj.dest || undefined,
    _transform: obj && obj.transform || undefined
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

function transform(options) {
  for (var _len4 = arguments.length, transform = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    transform[_key4 - 1] = arguments[_key4];
  }

  options._transform = transform;
  return options;
}
module.exports = exports['default'];