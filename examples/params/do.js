var task = require("../../");

task('echo', function (t) {
  t.exec('echo "{0}"', t.params.msg || 'usage: node do msg=something"').then(t.done);
});

task('default', task.once('echo'));
