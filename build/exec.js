'use strict';

var _chalk = require('chalk');

var execspawn = require('npm-execspawn');
var eos = require('end-of-stream');
var byline = require('byline');

module.exports = exec;

function exec(task, cmd) {
  if (!cmd || typeof cmd !== 'string') return task.done();

  task.info(task, 'Executing ' + task);

  var child = execspawn(cmd);

  task.processes.push(child);

  byline(child.stdout).pipe(task.stdout);
  byline(child.stderr).pipe(task.stderr);

  eos(child, function (err) {
    if (err) return console.error(_chalk.red('    Error:') + ' Failed to run %s: %s', cmd, err.toString());
    task.done();
  });

  return child.stdout;
}