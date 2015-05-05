'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _formatText = require('format-text');

var _formatText2 = _interopRequireDefault(_formatText);

var _npmExecspawn = require('npm-execspawn');

var _npmExecspawn2 = _interopRequireDefault(_npmExecspawn);

var _endOfStream = require('end-of-stream');

var _endOfStream2 = _interopRequireDefault(_endOfStream);

var _byline = require('byline');

var _byline2 = _interopRequireDefault(_byline);

var _chalk = require('chalk');

exports['default'] = exec;

function exec(task, cmd) {
  if (!cmd || typeof cmd !== 'string') return task.done();

  var formatted = _formatText2['default'].apply(undefined, Array.prototype.slice.call(arguments, 1));

  task.info(task, 'Executing "{0}"', formatted);

  var child = _npmExecspawn2['default'](formatted);

  task.processes.push(child);

  _byline2['default'](child.stdout).pipe(task.stdout);
  _byline2['default'](child.stderr).pipe(task.stderr);

  _endOfStream2['default'](child, function (err) {
    if (err) return console.error(_chalk.red('    Error:') + ' Failed to run %s: %s', formatted, err.toString());
    task.done();
  });

  return child.stdout;
}
module.exports = exports['default'];