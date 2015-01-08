I've been using bud with gulp for the last 6 months, and I find that it's actually much more pleasant to work with than gulp's default task manager (orchestrator). I recently forked bud and made some changes that may be of interest to the community. It can be found [here](https://github.com/RnbWd/bud), and I'm working on documentation [here](https://github.com/RnbWd/gulp-bud). Everything is hosted on github and privately [here](https://nasync.com) - I don't want to pollute the global npm namespace *quite yet*. Here are the changes: 

**task** refers to `require('bud')` and **t** refers to `task('name', function(t)`

**Breaking:**

- task.files and t.files are functions (but operate the same)

**Additions:**

- task has two additional methods: path and dest, which both accept files, but those files are not watched
- t has quite a few additional methods: path, glob, src, dest, and end
- t.watch & t.path hold a reference to files passed via task.watch and task.path, respectively (t.options._dest gets task.dest)
- t.src and t.dest map on one-to-one with gulp.src and gulp.dest, respectively
- t.end is a wrapper for [end-of-stream](https://www.npmjs.com/package/end-of-stream), calling t.done when the stream ends

**Rationale and Patterns**

Previously, I had been using this pattern to combine gulp streams and bud:

```
var task = require('task')
var vfs = require('vinyl-fs')
var eos = require('end-of-stream')

task('scripts', function(t) {
  var stream = vfs.src('./src/**')
   .pipe(..)
   .pipe(vfs.dest('./public'));
   
  eos(stream, t.done);
})
```

This pattern isn't that bad, and completely manageable on it's own, but there's a lot of repetition. I actually separate all my tasks into different files that I'll require into one index.js, so my main task file looks something like this:

```
var task = require('bud')
var scripts = require('./scripts')

task('scripts', scripts);
task('default', task.once('scripts');
```

I also found that it was nice to include files like this:

```
task('scripts', function(t) {
  var stream = vfs.src(t.files)
   .pipe(..)
   ...
})
```

But things got messy very quickly when I was watching files, and folders needed to be built before others, etc. So, I created a way to pass files that aren't necessarily watched:

```
task('scripts', task.path('./src/**'), function(t) {
  var stream = vfs.src(t.path)
   .pipe(..)
   ...
})
```

I also included vfs into t, and created a pattern where I can define the files in my index.js without having to rename every name in individual modules:

```
task('scripts', task.path('./src/**').dest('./public'), function(t) {
  var stream = t.src() // t.src(t.path)
   .pipe(..)
   .pipe(t.dest()) // t.dest(t.options._dest)
})
```

The final piece was wrapping end-of-stream, to get a pattern looking like this:

```
task('scripts', task.path('./src/**').dest('./public'), scripts);

function scripts(t) {
  t.end(
    t.src() 
     .pipe(..)
     .pipe(t.dest())
  );
}
```
