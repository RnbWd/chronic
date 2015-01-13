'use strict';

var meow = require('meow');
var c = require('chalk');
var help = [
  c.green('Usage'),
  c.white('  node <filename> <tasks> <options>'),
  ''
].join('\n');

var cmd = meow({
    pkg: '../package.json',
    help: help
}, { alias: {h: 'help', v: 'version', l: 'list', w: 'watch'},
     boolean: ['list', 'watch']
});

var input = cmd.input;
var flags = cmd.flags;
var map = require("./map");

if (flags.list) {
  return list();
}

pick();

// if (!tasks.length && !Object.keys(flags).length) {
//   return cmd.showHelp();
// } else {
//   pick();
// }

function list () {
  console.log(c.bold.green('  Tasks \n'));

  var key, tasks = map.tasks;
  for (key in tasks) {
    if(tasks.hasOwnProperty(key)) {
      console.log(c.grey('  ❯'), c.bold(key));
    }
    console.log('');
  } 
}

function pick () {
  if (!input.length) {
    if (map.has('default')) 
      return run(map.get('default'));
    else 
      return cmd.showHelp();
  } 

  input.forEach(function (key) {
    var t = map.get(key);

    if (!t) {
      return;
    }
    run(t);
  });
}

function run (t) {
  t.params = flags;
  t.run(flags.watch);
}
