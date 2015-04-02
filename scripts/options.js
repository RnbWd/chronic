"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Struct = _interopRequire(require("new-struct"));

var Options = Struct({
  New: New,
  after: after,
  source: source,
  watch: watch,
  dest: dest,
  transform: transform
});

module.exports = Options;

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
  for (var _len = arguments.length, source = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    source[_key - 1] = arguments[_key];
  }

  options._source = source;
  return options;
}

function watch(options) {
  for (var _len = arguments.length, watch = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    watch[_key - 1] = arguments[_key];
  }

  options._watch = watch;
  return options;
}

function dest(options, dest) {
  options._dest = dest;
  return options;
}

function transform(options) {
  for (var _len = arguments.length, transform = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    transform[_key - 1] = arguments[_key];
  }

  options._transform = transform;
  return options;
}