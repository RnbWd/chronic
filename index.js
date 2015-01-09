var Task = require("./lib/task");
var Options = require("./lib/options");

process.nextTick(function () {
  require('./lib/cli');
});

module.exports = create;
module.exports.path = path;
module.exports.watch = watch;
module.exports.once = once;
module.exports.build = build;
module.exports.transform = transform;

function create () {
  return Task.New.apply(undefined, arguments);
}

function path () {
  return Options.New({
    path: Array.prototype.slice.call(arguments)
  });
}

function watch () {
  return Options.New({
    watch: Array.prototype.slice.call(arguments)
  });
}

function build (t) {
  t.transform();
}

function transform () {
  return Options.New({
    transform: Array.prototype.slice.call(arguments)
  });
}

function once () {
  return Options.New({
    once: Array.prototype.slice.call(arguments)
  });
}
