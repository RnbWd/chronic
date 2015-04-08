'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _green$white$cyan$bold$white$grey$green = require('chalk');

var _meow = require('meow');

var _meow2 = _interopRequireWildcard(_meow);

var _map = require('./map');

var _map2 = _interopRequireWildcard(_map);

var help = '\n  ' + _green$white$cyan$bold$white$grey$green.green('Usage') + ' \n\n  ' + _green$white$cyan$bold$white$grey$green.white('  node <filename> ') + ' ' + _green$white$cyan$bold$white$grey$green.cyan('<tasks> ') + ' ' + _green$white$cyan$bold$white$grey$green.bold('<params>') + '\n\n  ' + _green$white$cyan$bold$white$grey$green.bold('  -h --help  ') + ' + ' + _green$white$cyan$bold$white$grey$green.white('- displays instructions') + '\n  ' + _green$white$cyan$bold$white$grey$green.bold('  -l --list  ') + ' + ' + _green$white$cyan$bold$white$grey$green.white('- displays available tasks') + '\n  ' + _green$white$cyan$bold$white$grey$green.bold('  -w --watch ') + ' + ' + _green$white$cyan$bold$white$grey$green.white('- watches files') + '\n';

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
  console.log(_green$white$cyan$bold$white$grey$green.bold.green('  Tasks \n'));
  var key,
      tasks = _map2['default'].tasks;
  for (key in tasks) {
    if (tasks.hasOwnProperty(key)) {
      console.log(_green$white$cyan$bold$white$grey$green.grey('  ❯'), _green$white$cyan$bold$white$grey$green.bold(key));
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