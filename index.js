var Task = require('./build/task')
var init = require('./build/init');

process.nextTick(function () {
  require('./build/cli')
})

module.exports = create
module.exports.after = init.after
module.exports.source = init.source
module.exports.watch = init.watch
module.exports.dest = init.dest

function create () {
  return Task.New.apply(undefined, arguments)
}
