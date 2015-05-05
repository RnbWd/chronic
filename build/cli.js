'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chalk = require('chalk');

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _map = require('./map');

var _map2 = _interopRequireDefault(_map);

var help = '\n  ' + _chalk.green('Usage') + ' \n\n  ' + _chalk.white('  node <filename> ') + ' ' + _chalk.cyan('<tasks> ') + ' ' + _chalk.bold('<params>') + '\n\n  ' + _chalk.bold('  -h --help  ') + ' + ' + _chalk.white('- displays instructions') + '\n  ' + _chalk.bold('  -l --list  ') + ' + ' + _chalk.white('- displays available tasks') + '\n  ' + _chalk.bold('  -w --watch ') + ' + ' + _chalk.white('- watches files') + '\n';

var cmd = _meow2['default']({
  pkg: '../package.json',
  help: help
}, { alias: { h: 'help', v: 'version', l: 'list', w: 'watch' },
  boolean: ['list', 'watch']
});

var input = cmd.input;
var flags = cmd.flags;

flags.list ? list() : pick();

function list() {
  console.log(_chalk.bold.green('  Tasks \n'));
  var key,
      tasks = _map2['default'].tasks;
  for (key in tasks) {
    if (tasks.hasOwnProperty(key)) {
      console.log(_chalk.grey('  ❯'), _chalk.bold(key));
    }
    console.log('');
  }
}

function pick() {
  if (!input.length) {
    if (_map2['default'].has('default')) {
      return run(_map2['default'].get('default'));
    } else {
      return cmd.showHelp();
    }
  }

  input.forEach(function (key) {
    var t = _map2['default'].get(key);

    if (!t) {
      return;
    }
    run(t);
  });
}

function run(t) {
  t.params = flags;
  t.run(flags.watch);
}