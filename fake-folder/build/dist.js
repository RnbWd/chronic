a
b
c
var task = require('../../')
var concat = require('concat')
var rmrf = require("rimraf-glob")

var build = task // for self documentation

build('dist.js', build.files('**/*.js').ignore('dist.js'), function (b) {
  concat(b.files, 'dist.js', b.done)
})

build('dist.css', build.files('**/*.css').ignore('dist.css'), function (b) {
  concat(b.files, 'dist.css', b.done)
})

task('test local bins', build.files('a.js'), function (t) {
  t.exec('prova a.js')
    .then(t.done);
});

task('start server', build.once('dist.js', 'dist.css'), function (t) { // will run dist.js and dist.css tasks first parallelly
  t.exec('echo "hello world"')
    .then('echo "about the start the server... one sec')
    .then('echo yo')
    .then('python -m SimpleHTTPServer')
    .then(t.done);
});

task('clean', function (t) {
  rmrf('dist*', t.done);
});

task('default', task.once('dist.js', 'dist.css'));
