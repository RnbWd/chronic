'use strict';

var debug = require("local-debug")('cli');
var style = require("style-format");
var cmd = require('new-command')
var command = cmd({
  w: 'watch',
  l: 'list'
});

var params = readParams(command._);

var map = require("./map");

if (command.list) {
  return list();
}

pick();

function list () {
  console.log(style('\n  {bold}{green}Tasks{reset} {grey}%s{reset}\n'), command._[0] || process.argv[1]);

  var key;
  for (key in map.tasks) {
    console.log(style('  {grey}❯{reset} {bold}%s{reset} {grey}%s{reset}'), key, map.get(key).name);
  }

  console.log('');
}

function pick () {
  var tasks = command._;

  if (!tasks.length && map.has('default')) {
    run(map.get('default'));
  } else if (!tasks.length) {
    cmd.help();
  }

  tasks.forEach(function (key) {
    var t = map.get(key);

    if (!t) {
      debug('"%s" is not a recognized task.', key);
      return;
    }

    run(t);
  });
}

function run (t) {
  t.params = params;
  t.run(command.watch);
}

function readParams (args) {
  var params = {};
  var i = args.length;
  var parts;

  while (i--) {
    if (!/\w+\=\w+/.test(args[i])) continue;
    parts = args[i].split('=');
    params[parts[0]] = parts[1];
    args.splice(i, 1);
  }

  return params;
}