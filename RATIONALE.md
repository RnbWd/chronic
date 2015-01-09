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
