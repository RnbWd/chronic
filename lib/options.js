var Struct = require("new-struct");

var Options = Struct({
  New: New,
  path: path,
  dest: dest,
  watch: watch,
  pump: pump
});

module.exports = Options;

function New (obj) {
  return Options({
    _path: obj && obj.path || undefined,
    _dest: obj && obj.dest || undefined,
    _once: obj && obj.once || undefined,
    _watch: obj && obj.watch || undefined,
    _pump: obj && obj.pump || undefined
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

function pump (options) {
  options._pump = Array.prototype.slice.call(arguments, 1);
  return options;
}




