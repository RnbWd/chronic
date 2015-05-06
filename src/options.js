const Struct = require('new-struct');

const Options = Struct({
  New: New,
  after: after,
  source: source,
  watch: watch,
  dest: dest
});

module.exports = Options;

function New (obj) {
  return Options({
    _after: obj && obj.after || undefined,
    _source: obj && obj.source || undefined,
    _watch: obj && obj.watch || undefined,
    _dest: obj && obj.dest || undefined
  })
}

function after (options, ...after) {
  options._after = after
  return options
}

function source (options, ...source) {
  options._source = source
  return options
}

function watch (options, ...watch) {
  options._watch = watch
  return options
}

function dest (options, dest) {
  options._dest = dest
  return options
}
