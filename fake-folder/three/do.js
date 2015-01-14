var task = require('../../')

task('say hello', function (t) {
  t.exec('echo "hello!"')
    .then("date '+%d %h %H:%M'")
    .then(t.done)
})
