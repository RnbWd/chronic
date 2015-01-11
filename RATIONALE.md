## Rationale

My goal is to provide a balance between *configuration and customization* through the creation of *task-transducers*. Inspired by Rich Hickey's [talk](https://www.youtube.com/watch?v=6mTbuzafcII), the idea is that you should be able to define very *generic streaming-transforms (ala gulp)* that don't care about *I/O*. It shouldn't matter what files are going in or going out, transforms work the same regardless. This idea is not radical or new, nor does it require an additional library. It's just the glue holding everything together that's modified *ever-so-slightly* so you can **choose** how to best use it for your own needs. Chronic doesn't actually create transducers for you, that's your job!

### Background

Chronic is a task manager that works very similar gulp. It's built on top of azer's [bud](https://github.com/azer/bud), which is a small task manager, and it incorporates the [vinyl-fs](https://github.com/wearefractal/vinyl-fs). If you've looked at gulp's [source code](https://github.com/gulpjs/gulp/blob/master/index.js), you'll see that it's mostly built from these two libraries: 

* [orchestrator](https://github.com/orchestrator/orchestrator) - the task manager `gulp.task`
* [vinyl-fs](https://github.com/wearefractal/vinyl-fs) - the streaming file-system `gulp.src` and `gulp.dest`

I realized that those libraries can be *decoupled* and used *independently* of one another. After discovering azer's [bud](https://github.com/azer/bud), I began using it as my primary task manger. At this point, you can stop reading and just use vinyl-fs with bud because that is ultimately what this library is all about... but there's two more fundamental aspects of this system that I've included - **stream error handling** and **optional modularity**.

### Stream error handling

When shit explodes, what happened? My gulp streams would break, then the system would collapse into a what I call a '*meta-unstable*' state. I figured out the hard way that handing errors in nodejs streams is non-intuitive. The solutions for handling errors in gulp are weird and ad-hoc. They encourage users to download 'gulp-plumber' and '[combine-streams](https://github.com/gulpjs/gulp/blob/master/docs/recipes/combining-streams-to-handle-errors.md)', and to return streams so that the task manager knows when it's finished. Ultimately, it's the task-manager's responsibility to know when a stream has finished or exploded so that it can delegate tasks properly. 

I searched github for people 'in the know' with node streams to see how they handled errors and callbacks, and I found [pump](https://github.com/mafintosh/pump). So I decided to wrap vinyl-streams in pump, and then I return the callback to the task manager upon completion or error:

```js
var pump = require('pump')

function(done) {
  pump(<src>, <transform>, <dest>, function(err) {
    done(err);
  })
}
```

Instead of writing this error-handling boilerplate in every file, I put it chronic:

```js
var chron = require('chronic');

chron('task' ,function(t) {
  t.build(<src>, <transform>, <dest>);
});
```

 Everything in chronic is optional to use, but having a simple and consistent way to handle nodejs streams is probably the most important feature of this library. 

### Optional Modularity

This principle is based on my own experience working with gulp and trying to reuse code on multiple projects. I break apart my tasks into commonjs modules, *where each module is responsible for a single task* ('html', 'css', 'js', ..). But if the project's fs changes, then I need to manually change the **src** and **dest** for *every single task-file*. I/O is inherently coupled with gulp streams via `gulp.src` and `gulp.dest`, making it *difficult to create reusable modules* for changing file-systems.  

My solution to this problem is *optional modularity* - which is the ability to *define parameters that are passed down into modules in a flexible manner*. This facilitates the creation of *an amorphous cuddle puddle of tasks*, where there are no strict boundaries between their composition or configuration. By *piping* I/O (`gulp.src` and `gulp.dest`) into modules that *pump together transducer-like-streaming-transforms*, you can create a very flexible build system.

### Examples

With minor modifications to azer's bud, I was able to develop a strain of code named *chronic*. This is what it looks like:

```bash
$ node build potato=baked -w
```

```js
/* build/bundle.js */

var browserify = require('browserify');
var source = require('vinyl-source');

module.exports = function(t) {
  var b = browserify();
  b.add(t.path[0]);  // './examples/three/do.js' 

  t.build(b.bundle(), source(t.path[1])/* bundle.js */, t.dest());

}

// files can be passed down from a central build index

```


```js
/* build/index.js */ 

var chron = require('chronic');
var concat = require('gulp-concat');

chron('default', chron.once('bundle', 'css', 'potato'));

chron('bundle', chron.once('concat')
  .path('./examples/chronic/bud.js', 'bundle.js')
  .dest('./build'),
  require('./bundle.js'));

// 'bundle' will wait for 'concat' to finish before starting, so I'm confident "chronic/bud.js" exists.

chron('concat', chron
  .watch('./examples/one/*.js', './examples/two/*.js'), 
  ctask);

function ctask(t) {
  t.build(t.src(t.watching), concat('bud.js'), t.dest('./examples/chronic'));
  // t.watching = ['./examples/params/*.js', './examples/params/*.js'] 
}

chron('css', chron
  .path('./examples/**/*.css')
  .transform(concat('style.css'))
  .dest('./examples/build')),
  chron.build);

// chron.build is boilerplate that pumps everything together

var paths = chron.path('./build/**').dest('./public');

chron('potato', paths, potato);

function potato(t) {
  if (t.params.potato == 'baked') {

    t.build(t.src(), t.dest());

  } else {
    console.log('you forgot to turn off the oven');
  }
}

```


### Conclusion

There is no one way to use the chronic. In fact, you could just use the patterns found here in your own projects. There's also a ton of features not mentioned (like the ability exec command-line functions and pipe into system). Check out azer's [bud](https://github.com/azer/bud) for more info - he's the real genius. 

