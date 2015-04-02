"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var format = _interopRequire(require("format-text"));

var execspawn = _interopRequire(require("npm-execspawn"));

var eos = _interopRequire(require("end-of-stream"));

var byline = _interopRequire(require("byline"));

var red = require("chalk").red;

module.exports = exec;

function exec(task, cmd) {
  if (!cmd || typeof cmd !== "string") {
    return task.done();
  }var formatted = format.apply(undefined, Array.prototype.slice.call(arguments, 1));

  task.info(task, "Executing \"{0}\"", formatted);

  var child = execspawn(formatted);

  task.processes.push(child);

  byline(child.stdout).pipe(task.stdout);
  byline(child.stderr).pipe(task.stderr);

  eos(child, function (err) {
    if (err) return console.error(red("    Error:") + " Failed to run %s: %s", formatted, err.toString());
    task.done();
  });

  return child.stdout;
}