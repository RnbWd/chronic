'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _format = require('format-text');

var _format2 = _interopRequireWildcard(_format);

var _execspawn = require('npm-execspawn');

var _execspawn2 = _interopRequireWildcard(_execspawn);

var _eos = require('end-of-stream');

var _eos2 = _interopRequireWildcard(_eos);

var _byline = require('byline');

var _byline2 = _interopRequireWildcard(_byline);

var _red = require('chalk');

exports['default'] = exec;

function exec(task, cmd) {
  if (!cmd || typeof cmd !== 'string') {
    return task.done();
  }var formatted = _format2['default'].apply(undefined, Array.prototype.slice.call(arguments, 1));

  task.info(task, 'Executing "{0}"', formatted);

  var child = _execspawn2['default'](formatted);

  task.processes.push(child);

  _byline2['default'](child.stdout).pipe(task.stdout);
  _byline2['default'](child.stderr).pipe(task.stderr);

  _eos2['default'](child, function (err) {
    if (err) return console.error(_red.red('    Error:') + ' Failed to run %s: %s', formatted, err.toString());
    task.done();
  });

  return child.stdout;
}
module.exports = exports['default'];