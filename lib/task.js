var Struct = require("new-struct");
var vinyl = require('vinyl-fs');
var eos = require('end-of-stream');
var pump = require('pump');
var debug = require("local-debug")('task');
var format = require("format-text");
var rightpad = require("right-pad");
var style = require("style-format");
var through = require("through");
var chokidar = require('chokidar');
var Options = require("./options");
var map = require("./map");
var run = require("./run");
var exec = require("./exec");
var globby = require('globby');


var Task = Struct({
  New: New,
  done: done,
  run: run,
  watch: watch,
  files: globglob,
  exec: exec,
  src: src,
  dest: dest,
  end: end
});

var colors = [
  'red',
  'green',
  'cyan',
  'magenta'
];

module.exports = Task;

function New (name, options, fn) {
  if (arguments.length === 2 && typeof options === 'function') {
    fn = options;
    options = Options.New();
  }

  debug('Created new task "%s"%s', name, options && options._watch ? (' watching ' + options._watch.join(',')) : '');

  var task = map.set(name, Task({
    name: name,
    key: map.slug(name),
    options: options,
    path: options._path,
    watching: options._watch,
    files: globglob,
    src: src,
    dest: dest,
    fn: fn,
    pump: pump,
    done: done,
    color: nextColor(),
    processes: [],
    params: {},
    info: info,
    end: end
  }));

  stdout();
  stderr();

  return task;

  function stdout () {
    if (task.stdout) {
      task.stdout.destroy();
    }

    task.stdout = std(task, stdout);
    task.stdout.pipe(process.stdout).setMaxListeners(0);
  }

  function stderr () {
    if (task.stderr) {
      task.stderr.destroy();
    }

    task.stderr = std(task, stderr);
    task.stderr.pipe(process.stderr).setMaxListeners(0);
  }
}

function std (task, callback) {
  return through(function (line) {
    this.queue(beautify(task, line));
  }, callback);
}

function done (task) {
  var diff = Date.now() - task.startTS;

  task.info(task, 'Completed in {0}', humanize(diff));

  task.onDone.publish();
  delete task.onDone;
  delete task.startTS;
}

function humanize (ms) {
  var sec = 1000;
  var min = 60 * 1000;
  var hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';

  return ms + 'ms';
}

function watch (task) {
  if (!task.watching && !task.path) return;
  var files;
  if (task.watching) {
    files = task.files('watching');
  } else {
    files = task.files('path');
  }
  debug('Watching changes on %s\'s files: %s (Total: %d files)', task.key, files.slice(0, 5).join(', '), files.length);

  var watcher = chokidar.watch(files, { persistent: true, interval: 250 });

  watcher.on('change', function() {
    debug('Restarting %s after the changes', task.key);
    task.run(false, true);
  });

  return watcher;
}

function nextColor () {
  if (typeof colors.next === 'undefined')
    colors.next = 0;
  else
    colors.next++;

  return colors[colors.next % colors.length];
}

function info (task) {
  var text = format.apply(undefined, Array.prototype.slice.call(arguments, 1));
  var key = rightpad(task.key, map.len);
  console.log(style(format('    {' + task.color + '}' + key + '{reset}  {grey}' + text + '{reset}')));
}

function beautify (task, line) {
  var key = rightpad(task.key, map.len);

  return style(format('    {color}{key}{reset} {line}', {
    color: '{' + task.color + '}',
    line: line.toString(),
    key: key
  })) + '\n';
}

function end (task, stream) {
  return eos(stream, task.done);
}

function globglob (task, opt) {
  if (task.path && opt === 'path')
    return globby.sync(task.path);
  else if (task.watching && opt === 'watching')
    return globby.sync(task.watching);
  else if (task.path || task.watching) {
    if (!opt) {
      var path = task.path || task.watching;
      return globby.sync(path);
    }
  } else {
    return [];
  }
}

function src (task, path) {
  if (path){
    return vinyl.src(path);
  } else if (task.path) {
    return vinyl.src(task.path);
  }
}

function dest (task, path) {
  if (path) {
    return vinyl.dest(path);
  } else if (task.options._dest) {
    return vinyl.dest(task.options._dest);
  }
}