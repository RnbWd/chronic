var Task = require("./lib/task");
var Options = require("./lib/options");

process.nextTick(function () {
  require('./lib/cli');
});

module.exports = create;
module.exports.once = once;
module.exports.path = path;
module.exports.watch = watch;
module.exports.transform = transform;
module.exports.dest = dest;
module.exports.build = build;


function create () {
  return Task.New.apply(undefined, arguments);
}

function once () {
  return Options.New({
    once: Array.prototype.slice.call(arguments)
  });
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

function transform () {
  return Options.New({
    transform: Array.prototype.slice.call(arguments)
  });
}

function dest () {
  return Options.New({
    dest: Array.prototype.slice.call(arguments)
  });
}

function build (t) {
  t.combine();
}

