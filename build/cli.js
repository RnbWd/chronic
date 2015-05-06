'use strict';

var _chalk = require('chalk');

var meow = require('meow');
var map = require('./map');

var help = '\n  ' + _chalk.green('Usage') + ' \n\n  ' + _chalk.white('  node <filename> ') + ' ' + _chalk.cyan('<tasks> ') + ' ' + _chalk.bold('<params>') + '\n\n  ' + _chalk.bold('  -h --help  ') + ' + ' + _chalk.white('- displays instructions') + '\n  ' + _chalk.bold('  -l --list  ') + ' + ' + _chalk.white('- displays available tasks') + '\n  ' + _chalk.bold('  -w --watch ') + ' + ' + _chalk.white('- watches files') + '\n';

var cmd = meow({
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
      tasks = map.tasks;
  for (key in tasks) {
    if (tasks.hasOwnProperty(key)) {
      console.log(_chalk.grey('  ❯'), _chalk.bold(key));
    }
    console.log('');
  }
}

function pick() {
  if (!input.length) {
    if (map.has('default')) {
      return run(map.get('default'));
    } else {
      return cmd.showHelp();
    }
  }

  input.forEach(function (key) {
    var t = map.get(key);

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