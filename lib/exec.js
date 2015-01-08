var debug = require("local-debug")('exec');
var loop = require("serial-loop");
var fs = require("fs");
var child_process = require("child_process");
var byline = require("byline");
var style = require("style-format");
var readJSON = require("read-json");
var path = require("path");
var format = require("format-text");

module.exports = exec;

function exec (task) {
  var commands = [];

  process.nextTick(run);

  return then.apply(undefined, Array.prototype.slice.call(arguments, 1));

  function then (command) {
    var formatted;

    if (typeof command === 'string') {
      formatted = format.apply(undefined, arguments);
      commands.push(formatted);
    }

    return { then: then };
  }

  function run () {
    loop(commands.length, each, function () {});
  }

  function each (done, i) {
    var cmd = commands[i];

    if (typeof cmd === 'function') {
      cmd();
      return done();
    }

    debug('%s spawns %s', task.key, cmd);
    task.info(task, 'Executing "{0}"', cmd);

    var parts = cmd.split(' ');
    var name = parts[0];
    var args = parts.slice(1);
    var child;

    preferLocalBin(name, function (preferredName) {
      child = child_process.spawn(preferredName, args);

      task.processes.push(child);

      debug('Added %d to the processes of %s', child.pid, task.key);

      byline(child.stdout).pipe(task.stdout);
      byline(child.stderr).pipe(task.stderr);

      child.on('error', function (error) {
        console.error(style('    {red}Error:{reset} Failed to run %s: %s'), cmd, error.toString());
      });

      child.on('close', done);
    });
  }
}

function preferLocalBin (name, callback) {
  var lookup = [
    './node_modules/' + name + '/package.json',
    '../node_modules/' + name + '/package.json',
    '../../node_modules/' + name + '/package.json'
  ];

  var manifest;
  var dir;

  loop(lookup.length, each, function () {
    return callback(name);
  });

  function each (done, index) {
    var filename = lookup[index];

    fs.exists(filename, function (exists) {
      if (!exists) return done();

      readJSON(filename, function (error, manifest) {
        if (error) return done();

        dir = path.dirname(filename);

        if (!manifest || !manifest.bin || !manifest.bin[name]) return done();

        var resolved = dir + '/' + path.join(manifest.bin[name]);
        debug('Command %s resolved as %s', name, resolved);

        return callback(resolved);
      });
    });
  }
}
