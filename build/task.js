'use strict';

var _chalk = require('chalk');

var Struct = require('new-struct');
var vinyl = require('vinyl-fs');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var pump = require('pump');
var eos = require('end-of-stream');
var through = require('through2');
var chokidar = require('chokidar');
var rightpad = require('right-pad');
var Options = require('./options');
var map = require('./map');
var run = require('./run');
var exec = require('./exec');

var Task = Struct({
  New: New,
  done: done,
  run: run,
  watch: watch,
  exec: exec,
  build: build,
  src: src,
  dest: dest
});

var colors = [_chalk.red, _chalk.green, _chalk.cyan, _chalk.magenta, _chalk.yellow];

module.exports = Task;

function New(name, options, fn) {
  if (fn == undefined && typeof options === 'function') {
    fn = options;
    options = Options.New();
  }

  var task = map.set(name, Task({
    name: name,
    key: map.slug(name),
    options: options,
    path: options._dest,
    files: options._source,
    src: src,
    dest: dest,
    fn: fn,
    build: build,
    done: done,
    color: nextColor(),
    processes: [],
    params: {},
    info: info,
    pump: pump,
    eos: eos,
    source: source,
    buffer: buffer
  }));

  stdout();
  stderr();

  return task;

  function stdout() {
    if (task.stdout) {
      task.stdout.destroy();
    }

    task.stdout = std(task, stdout);
    task.stdout.pipe(process.stdout).setMaxListeners(0);
  }

  function stderr() {
    if (task.stderr) {
      task.stderr.destroy();
    }

    task.stderr = std(task, stderr);
    task.stderr.pipe(process.stderr).setMaxListeners(0);
  }
}

function std(task, callback) {
  return through(function (line, enc, cb) {
    this.push(beautify(task, line));
    cb();
  }, callback);
}

function done(task, err) {
  var diff = Date.now() - task.startTS;

  task.info(task, 'Completed in ' + humanize(diff));
  if (err) console.warn(err);
  task.onDone.publish();

  delete task.running;
  delete task.onDone;
  delete task.startTS;
}

function watch(task) {
  if (!task.watching) return;

  var watcher = chokidar.watch(task.watching, { persistent: true, interval: 250 });
  console.log('  ' + _chalk.white('watching: ') + _chalk.cyan(task.key));

  watcher.on('change', function (path) {
    if (!task.running) {
      console.log('  ' + _chalk.white('changed: ') + _chalk.cyan(path));
      task.run(false, true);
    }
  });

  return watcher;
}

function build(task) {
  for (var _len = arguments.length, items = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    items[_key - 1] = arguments[_key];
  }

  return pump(items, function (err) {
    task.done(err);
  });
}

function src(task, path) {
  if (path) {
    return vinyl.src(path);
  } else if (task.files) {
    return vinyl.src(task.files);
  }
}

const dest = (task, path) => vinyl.dest(path || task.path);

function info(task, text) {
  var key = rightpad(task.key, map.len);
  console.log('   ' + task.color(key) + '   ' + _chalk.grey(text));
}

function beautify(task, line) {
  var key = rightpad(task.key, map.len);

  return '  ' + task.color(key) + '  ' + _chalk.grey(String(line)) + '\n';
}

function nextColor() {
  if (typeof colors.next === 'undefined') {
    colors.next = 0;
  } else {
    colors.next++;
  }
  return colors[colors.next % colors.length];
}

function humanize(ms) {
  var sec = 1000;
  var min = 60 * 1000;
  var hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';

  return ms + 'ms';
}
