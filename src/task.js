import {red, green, cyan, magenta, yellow, white, grey} from 'chalk';

let Struct = require('new-struct')
let vinyl = require('vinyl-fs')
let source = require('vinyl-source-stream')
let buffer = require('vinyl-buffer')
let pump = require('pump')
let eos = require('end-of-stream')
let through = require('through2')
let chokidar = require('chokidar')
let format = require('format-text')
let rightpad = require('right-pad')
let Options = require('./options')
let map = require('./map')
let run = require('./run')
let exec = require('./exec')

var Task = Struct({
  New: New,
  done: done,
  run: run,
  watch: watch,
  exec: exec,
  build: build,
  src: src,
  dest: dest
})

var colors = [
  red,
  green,
  cyan,
  magenta,
  yellow
]

module.exports = Task

function New (name, options, fn) {
  if (arguments.length === 2 && typeof options === 'function') {
    fn = options
    options = Options.New()
  }

  var task = map.set(name, Task({
    name: name,
    key: map.slug(name),
    options: options,
    path: options._dest,
    files: options._source,
    src: src,
    dest: dest,
    fn: fn,
    build: build,
    done: done,
    color: nextColor(),
    processes: [],
    params: {},
    info: info,
    pump: pump,
    eos: eos,
    source: source,
    buffer: buffer
  }))

  stdout()
  stderr()

  return task

  function stdout () {
    if (task.stdout) {
      task.stdout.destroy()
    }

    task.stdout = std(task, stdout)
    task.stdout.pipe(process.stdout).setMaxListeners(0)
  }

  function stderr () {
    if (task.stderr) {
      task.stderr.destroy()
    }

    task.stderr = std(task, stderr)
    task.stderr.pipe(process.stderr).setMaxListeners(0)
  }
}

function std (task, callback) {
  return through(function (line, enc, cb) {
    this.push(beautify(task, line))
    cb()
  }, callback)
}

function done (task, err) {
  var diff = Date.now() - task.startTS

  task.info(task, 'Completed in {0}', humanize(diff))
  if (err) console.warn(err)
  task.onDone.publish()

  delete task.running
  delete task.onDone
  delete task.startTS
}

function watch (task) {
  if (!task.watching) return

  var watcher = chokidar.watch(task.watching, { persistent: true, interval: 250 })
  console.log('  ' + white('watching: ') + cyan(task.key))

  watcher.on('change', function (path) {
    if (!task.running) {
      console.log('  ' + white('changed: ') + cyan(path))
      task.run(false, true)
    }
  })

  return watcher
}

function build (task, ...items) {
  return pump(items, function (err) {
    task.done(err)
  })
}

function src (task, path) {
  if (path) {
    return vinyl.src(path)
  } else if (task.files) {
    return vinyl.src(task.files)
  }
}

function dest (task, path) {
  if (path) {
    return vinyl.dest(path)
  } else if (task.path) {
    return vinyl.dest(task.path)
  }
}

function info (task, ...infos) {
  var key = rightpad(task.key, map.len)

  var text = format.apply(undefined, infos)
  console.log(`   ${task.color(key)}   ${grey(text)}`)
}

function beautify (task, line) {
  var key = rightpad(task.key, map.len)

  return '  ' + task.color(key) + '  ' + grey(String(line)) + '\n'
}

function nextColor () {
  if (typeof colors.next === 'undefined') {
    colors.next = 0
  } else {
    colors.next++
  }
  return colors[colors.next % colors.length]
}

function humanize (ms) {
  var sec = 1000
  var min = 60 * 1000
  var hour = 60 * min

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h'
  if (ms >= min) return (ms / min).toFixed(1) + 'm'
  if (ms >= sec) return (ms / sec | 0) + 's'

  return ms + 'ms'
}
