const pubsub = require('pubsub')
const parallel = require('fastparallel')({ results: false });
const map = require('./map')

module.exports = run

function run (task, watch, res, cb) {
  if (typeof watch === 'function') {
    cb = watch
    watch = undefined
  }

  if (typeof res === 'function') {
    cb = res
    res = undefined
  }

  task.info(task, 'Running...')
  task.startTS = Date.now()
  task.running = true

  runDependentsFirst(task, res, function (error) {
    if (error) return cb(error)

    task.watching = task.options._watch || []

    flattenFiles(task)

    callTaskFn(task, watch, res, cb)

  })
}

function callTaskFn (task, watch, res, cb) {
  if (res) {
    delete task.onDone
  }

  if (task.onDone) return task.onDone.subscribe(cb)

  task.onDone = pubsub()
  task.onDone.subscribe(cb)

  if (watch) {
    task.watch()
  }

  if (!task.fn) {
    return task.done()
  }

  task.fn(task)
}

function runDependentsFirst (task, res, cb) {
  if (!task.options._after || !task.options._after.length) return cb()

  parallel({}, runItem, task.options._after, cb)

  function runItem (item, done) {
    var t = map.get(item)
    if (!t) return done()
    if (t.running) return done()
    t.params = task.params
    t.run(false, res, done)
  }
}

function flattenFiles (task) {
  task.options._after && task.options._after.forEach(function (name) {
    var t = map.get(name)
    if (!t) return;
    if (t.options._watch) {
      task.watching = task.watching.concat(t.options._watch);
      return task.watching;
    }
  })
}
