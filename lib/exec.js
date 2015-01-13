'use strict';

var byline = require("byline");
var format = require("format-text");
var execspawn = require('npm-execspawn');
var eos = require('end-of-stream');
var chalk = require('chalk');

module.exports = exec;

function exec (task, cmd) {

  if (!cmd || typeof cmd !== 'string') return task.done();

  var formatted = format.apply(undefined, Array.prototype.slice.call(arguments, 1));

  task.info(task, 'Executing "{0}"', formatted);

  var child = execspawn(formatted);

  task.processes.push(child);

  byline(child.stdout).pipe(task.stdout);
  byline(child.stderr).pipe(task.stderr);

  eos(child, function(err) {
    if (err) return console.error(chalk.red('    Error:') + ' Failed to run %s: %s', formatted, err.toString());
     
     task.done();
  });

 return child.stdout;
  
}



