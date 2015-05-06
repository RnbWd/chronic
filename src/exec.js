const execspawn = require('npm-execspawn');
const eos = require('end-of-stream');
const byline = require('byline');
import {red} from 'chalk';

module.exports = exec;

function exec (task, cmd) {
  if (!cmd || typeof cmd !== 'string') return task.done()

  task.info(task, `Executing ${task}`);

  var child = execspawn(cmd)

  task.processes.push(child)

  byline(child.stdout).pipe(task.stdout)
  byline(child.stderr).pipe(task.stderr)

  eos(child, function (err) {
    if (err) return console.error(red('    Error:') + ' Failed to run %s: %s', cmd, err.toString())
    task.done()
  })

  return child.stdout

}
