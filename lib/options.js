var Struct = require("new-struct");
var debug = require("local-debug")('options');
var globby = require('globby');

var Options = Struct({
  New: New,
  once: once,
  path: path,
  watch: watch,
  dest: dest,
  expand: expand
});

module.exports = Options;

function New (obj) {
  return Options({
    _once: obj && obj.once || undefined,
    _path: obj && obj.path || undefined,
    _watch: obj && obj.watch || undefined,
    _dest: obj && obj.dest || undefined
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

function expand (options, done) {
  if (!options._watch || !options._watch.length) return done();
  if (options.files) return done();

  debug('Expanding %s', options._watch.join(','));

  globby(options._watch, function (err, paths) {
    if (err) return done(err);

    options.files = paths;
    done();
    
  });
}


