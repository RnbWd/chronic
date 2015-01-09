var Struct = require("new-struct");

var Options = Struct({
  New: New,
  path: path,
  dest: dest,
  watch: watch,
  transform: transform
});

module.exports = Options;

function New (obj) {
  return Options({
    _path: obj && obj.path || undefined,
    _dest: obj && obj.dest || undefined,
    _once: obj && obj.once || undefined,
    _watch: obj && obj.watch || undefined,
    _transform: obj && obj.transform || undefined
  });
}


function path (options) {
  options._path = Array.prototype.slice.call(arguments, 1);
  return options;
}

function dest (options, path) {
  options._dest = path;
  return options;
}

function watch (options) {
  options._watch = Array.prototype.slice.call(arguments, 1);
  return options;
}

function transform (options) {
  options._transform = Array.prototype.slice.call(arguments, 1);
  return options;
}




