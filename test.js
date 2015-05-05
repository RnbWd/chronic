/* global describe, it */

var chron = require('./');
var loop = require("parallel-loop");
var assert = require('assert');
var concat = require('gulp-concat');
var del = require('del');
var pump = require('pump');


describe('default', function() {
  chron('default', function(t) { console.log('hello'); t.done() });
  it('should run default', function() {});
})

describe('tasks', function() {
  var count = 0;
  it('should run a simple task', function (done) {
    var chron1 = chron('foo bar', function (t) {
      setTimeout(function () {
        t.done();
        count++
        if (count < 3) {
          t.run();
        } else {
          assert.equal(count, 3);
          done();
        }
      }, 100);
    });

    assert.equal(chron1.key, 'foo-bar');
    assert.equal(chron1.name, 'foo bar');
    assert.equal(chron1.watching, undefined);
    assert.equal(chron1.files, undefined);
    chron1.run();

  });

  it('should do some stuff I describe in examples', function (done) {

    chron('del', function(t) {
      del('./fake-folder/chronic/bud.js', function(err) {
        t.done(err);
      })
    })

    chron('concat', chron.after('del')
      .watch('./fake-folder/one/*.js', './fake-folder/two/*.js'),
      ctask)

    chron('bundle', chron.after('concat')
      .source('./fake-folder/chronic/bud.js', 'bundle.js')
      .dest('./fake-folder/build'),
      bundle).run()

    function bundle(t) {
      pump(t.src(t.files[0].toString()), t.dest(), function(err) {
        t.done();
        done(err);
      });
      assert.deepEqual(t.files, [ './fake-folder/chronic/bud.js', 'bundle.js' ]);
    }

    function ctask(t) {
      t.build(t.src(t.watching), concat('bud.js'), t.dest('./fake-folder/chronic'));
      assert.deepEqual(t.watching, ['./fake-folder/one/*.js', './fake-folder/two/*.js']);
    }


  });

  it('should run a task with options', function (done) {

    chron('lorem ipsum', chron.watch('**/*.js', '**/*.css', '!node_modules/**'), function (t) {
      assert.deepEqual(t.watching, [ '**/*.js', '**/*.css', '!node_modules/**' ]);
      t.done();
      done();
    }).run();

  });

  it('should run multiple tasks paralelly', function (done) {
    var count = 0;
    loop(10, each, function () {
      assert.equal(count, 10);
      done();
    });

    function each (finish, i) {
      var isRunning = true;
      count++;
      var chron1 = chron('task' + i, function (t) {
        assert.ok(isRunning);
        setTimeout(function () {
          isRunning = false;
          t.done();
        }, Math.floor(Math.random()*100));
      });
      chron1.run(finish);
    }
  });

  it('should watch files and depend on other tasks', function (done) {

    var t1done = false;
    var t2done = false;
    var t3done = false;

    chron('foo 1', chron.source('fake-folder/build/*.js').watch('fake-folder/build/*.js'), function (t) {
      assert.deepEqual(t.files, ['fake-folder/build/*.js']);
      assert.deepEqual(t.watching, [ 'fake-folder/build/*.js' ]);
      setTimeout(function () {
        t.done();
        t1done = true;
      }, 50);
    });

    chron('bar 2', chron.source('fake-folder/build/*.scss').dest('public').watch('fake-folder/build/*.css'), function (t) {
      assert.deepEqual(t.files, [ 'fake-folder/build/*.scss' ]);
      assert.equal(t.path, 'public');
      assert.deepEqual(t.watching, [ 'fake-folder/build/*.css' ]);
      setTimeout(function () {
        t.done();
        t2done = true;
      }, 100);
    });

    var t3 = chron('qux', chron.after('foo 1', 'bar-2'), function (t) {
      assert.deepEqual(t.watching, ["fake-folder/build/*.js","fake-folder/build/*.css"]);
      setTimeout(function () {
        assert.ok(t1done);
        assert.ok(t2done);
        t3done = true;
        t.done();
      }, 10);
    });

    t3.run(function () {
      assert.ok(t3done);
      done();
    });
  });
});
