var Task = require('./build/task')
var Options = require('./build/options')

process.nextTick(function () {
  require('./build/cli')
})

module.exports = create
module.exports.after = after
module.exports.source = source
module.exports.watch = watch
module.exports.dest = dest

function create () {
  return Task.New.apply(undefined, arguments)
}

function after () {
  return Options.New({
    after: Array.prototype.slice.call(arguments)
  })
}

function source () {
  return Options.New({
    source: Array.prototype.slice.call(arguments)
  })
}

function watch () {
  return Options.New({
    watch: Array.prototype.slice.call(arguments)
  })
}

function dest () {
  return Options.New({
    dest: Array.prototype.slice.call(arguments)
  })
}
