"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _chalk = require("chalk");

var green = _chalk.green;
var white = _chalk.white;
var cyan = _chalk.cyan;
var bold = _chalk.bold;
var white = _chalk.white;
var grey = _chalk.grey;
var green = _chalk.green;

var meow = _interopRequire(require("meow"));

var map = _interopRequire(require("./map"));

var help = "\n  " + green("Usage") + " \n\n  " + white("  node <filename> ") + " " + cyan("<tasks> ") + " " + bold("<params>") + "\n\n  " + bold("  -h --help  ") + " + " + white("- displays instructions") + "\n  " + bold("  -l --list  ") + " + " + white("- displays available tasks") + "\n  " + bold("  -w --watch ") + " + " + white("- watches files") + "\n";

var cmd = meow({
  pkg: "../package.json",
  help: help
}, { alias: { h: "help", v: "version", l: "list", w: "watch" },
  boolean: ["list", "watch"]
});

var input = cmd.input;
var flags = cmd.flags;

flags.list ? list() : pick();

function list() {
  console.log(bold.green("  Tasks \n"));
  var key,
      tasks = map.tasks;
  for (key in tasks) {
    if (tasks.hasOwnProperty(key)) {
      console.log(grey("  ❯"), bold(key));
    }
    console.log("");
  }
}

function pick() {
  if (!input.length) {
    if (map.has("default")) {
      return run(map.get("default"));
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