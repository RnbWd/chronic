'use strict';

var Struct = require("new-struct");

var Options = Struct({
  New: New,
  after: after,
  source: source,
  watch: watch,
  dest: dest,
  transform: transform
});

module.exports = Options;

function New (obj) {
  return Options({
    _after: obj && obj.after || undefined,
    _source: obj && obj.source || undefined,
    _watch: obj && obj.watch || undefined,
    _dest: obj && obj.dest || undefined,
    _transform: obj && obj.transform || undefined
  });
}

function after (options) {
  options._after = Array.prototype.slice.call(arguments, 1);
  return options;
}

function source (options) {
  options._source = Array.prototype.slice.call(arguments, 1);
  return options;
}

function watch (options) {
  options._watch = Array.prototype.slice.call(arguments, 1);
  return options;
}

function dest (options, source) {
  options._dest = source;
  return options;
}

function transform (options) {
  options._transform = Array.prototype.slice.call(arguments, 1);
  return options;
}


