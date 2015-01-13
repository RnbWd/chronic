'use strict';

var Struct = require("new-struct");

var Options = Struct({
  New: New,
  once: once,
  path: path,
  watch: watch,
  dest: dest,
  transform: transform
});

module.exports = Options;

function New (obj) {
  return Options({
    _once: obj && obj.once || undefined,
    _path: obj && obj.path || undefined,
    _watch: obj && obj.watch || undefined,
    _dest: obj && obj.dest || undefined,
    _transform: obj && obj.transform || undefined
  });
}

function once (options) {
  options._once = Array.prototype.slice.call(arguments, 1);
  return options;
}

function path (options) {
  options._path = Array.prototype.slice.call(arguments, 1);
  return options;
}

function watch (options) {
  options._watch = Array.prototype.slice.call(arguments, 1);
  return options;
}

function dest (options, path) {
  options._dest = path;
  return options;
}

function transform (options) {
  options._transform = Array.prototype.slice.call(arguments, 1);
  return options;
}


