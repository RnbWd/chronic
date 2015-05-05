import format from 'format-text'
import execspawn from 'npm-execspawn'
import eos from 'end-of-stream'
import byline from 'byline'
import {red} from 'chalk';

export default exec

function exec (task, cmd) {
  if (!cmd || typeof cmd !== 'string') return task.done()

  var formatted = format.apply(undefined, Array.prototype.slice.call(arguments, 1))

  task.info(task, 'Executing "{0}"', formatted)

  var child = execspawn(formatted)

  task.processes.push(child)

  byline(child.stdout).pipe(task.stdout)
  byline(child.stderr).pipe(task.stderr)

  eos(child, function (err) {
    if (err) return console.error(red('    Error:') + ' Failed to run %s: %s', formatted, err.toString())
    task.done()
  })

  return child.stdout

}
