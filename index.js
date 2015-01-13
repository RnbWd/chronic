var Task = require("./lib/task");
var Options = require("./lib/options");

process.nextTick(function () {
  require('./lib/cli');
});

module.exports = create;
module.exports.once = once;
module.exports.after = once;
module.exports.follow = once;
module.exports.path = path;
module.exports.src = path;
module.exports.watch = watch;
module.exports.files = watch;
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
  var transforms = t.options._transform || [];
  var list = [];
  list.push(t.src());
  list = list.concat(transforms);
  list.push(t.dest());
  t.pump(list, t.done);
}


