var Task = require("./lib/task");
var Options = require("./lib/options");

process.nextTick(function () {
  require('./lib/cli');
});

module.exports = create;
module.exports.after = after;
module.exports.source = source;
module.exports.watch = watch;
module.exports.transform = transform;
module.exports.dest = dest;
module.exports.build = build;


function create () {
  return Task.New.apply(undefined, arguments);
}

function after () {
  return Options.New({
    after: Array.prototype.slice.call(arguments)
  });
}

function source () {
  return Options.New({
    source: Array.prototype.slice.call(arguments)
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


