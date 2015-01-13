var debug = require("local-debug")('run');
var pubsub = require("pubsub");
var loop = require("parallel-loop");
var map = require("./map");

module.exports = run;

function killRunningProcesses (task) {
  task.processes.forEach(function (proc) {
    debug('Killing %s', proc.pid);
    proc.kill();
  });

  task.processes = [];
}

function run (task, watch, restart, callback) {
  task.info(task, 'Running...');

  if (typeof watch == 'function') {
    callback = watch;
    watch = undefined;
  }

  if (typeof restart == 'function') {
    callback = restart;
    restart = undefined;
  }

  task.startTS = Date.now();

  killRunningProcesses(task);

  runDependentsFirst(task, restart, function (error) {
    if (error) return callback(error);

    expandFilesIfNecessary(task, function (error) {
      if (error) return callback(error);

      flattenFiles(task);

      callTaskFn(task, watch, restart, callback);
    });

  });
}

function callTaskFn (task, watch, restart, callback) {
  if (restart) {
    task.onDone = undefined;
  }

  if (task.onDone) return task.onDone.subscribe(callback);

  task.onDone = pubsub();
  task.onDone.subscribe(callback);

  if (watch) {
    task.watch();
  }

  if (!task.fn) {
    return task.done();
  }

  task.fn(task);
}

function flattenFiles (task) {
  task.options._once && task.options._once.forEach(function (name) {
    var t = map.get(name);

    if (!t) return;
    if (!task.files) return task.files = t.files || [];

    task.files = task.files.concat(t.files || []);
  });
}


function runDependentsFirst (task, restart, callback) {
  if (!task.options._once || !task.options._once.length) return callback();

  loop(task.options._once.length, each, callback);

  function each (done, i) {
    var t = map.get(task.options._once[i]);

    if (!t) {
      debug('"%s" is not a valid task. Valid tasks: %s', task.options._once[i], Object.keys(map).join(','));
      return done();
    }

    t.params = task.params;
    t.run(false, restart, done);
  }
}

function expandFilesIfNecessary (task, callback) {
  if (task.files) return callback();

  debug('Expanding %s', task.options._watch);

  task.options.expand(function (error) {
    if (error) return callback(error);
    task.files = task.options.files;
    callback();
  });

}



