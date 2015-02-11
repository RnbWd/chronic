'use strict';

var pubsub = require("pubsub");
var each = require('each-async');
var map = require("./map");
var globby = require('globby');

module.exports = run;

function killRunningProcesses (task) {
  task.processes.forEach(function (proc) {
    proc.kill();
  });

  task.processes = [];
}

function run (task, watch, res, cb) {
  if (typeof watch === 'function') {
    cb = watch;
    watch = undefined;
  }

  if (typeof res === 'function') {
    cb = res;
    res = undefined;
  }

  task.info(task, 'Running...');
  task.startTS = Date.now();
  task.running = true;

  killRunningProcesses(task);

  runDependentsFirst(task, res, function (error) {
    if (error) return cb(error);

     expandFilesIfNecessary(task, function (error) {
      if (error) return cb(error);

      flattenFiles(task);

      callTaskFn(task, watch, res, cb);

    });

  });
}

function callTaskFn (task, watch, res, cb) {
  if (res) {
    delete task.onDone;
  }

  if (task.onDone) return task.onDone.subscribe(cb);

  task.onDone = pubsub();
  task.onDone.subscribe(cb);

  if (watch) {
    task.watch();
  }

  if (!task.fn) {
    return task.done();
  }

  task.fn(task);
}

function runDependentsFirst (task, res, cb) {
  if (!task.options._after || !task.options._after.length) return cb();

  each(task.options._after, function (item, index, done) {
    var t = map.get(item);
    if (!t) return done();
    if (t.running) return done();
    t.params = task.params;
    t.run(false, res, done);
  }, cb);
}

function expandFilesIfNecessary (task, cb) {
  if (task.watching) return cb();
  if (!task.options._watch || !task.options._watch.length) return cb();

  globby(task.options._watch, function (err, paths) {
    if (err) return cb(err);

    task.watching = paths;
    cb();
  });
}

function flattenFiles (task) {
  task.options._after && task.options._after.forEach(function (name) {
    var t = map.get(name);

    if (!t) return;
    if (!task.watching) 
      task.watching = t.watching || [];
    else
      task.watching = task.watching.concat(t.watching || []);

  });
}

