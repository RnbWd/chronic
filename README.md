# chronic

*adjective*: from Greek *khronikos* ‘of time,’ from *khronos* ‘time.’

[![NPM](https://nodei.co/npm/chronic.png)](https://nodei.co/npm/chronic/)

[![Build Status](https://travis-ci.org/RnbWd/chronic.svg?branch=master)](https://travis-ci.org/RnbWd/chronic)
[![Dependency Status](https://img.shields.io/david/rnbwd/chronic.svg?style=flat-square)](https://david-dm.org/rnbwd/chronic)
[![Stability Status](https://img.shields.io/badge/stability-stable-green.svg?style=flat-square)](https://github.com/dominictarr/stability#experimental)


```bash
npm install chronic --save-dev
```

## Background

My goal is to provide a balance between *configuration and customization* through the creation of *task-transducers*. This library is now a heavily modified version of azer's [bud](https://github.com/azer/bud) and gulp's [vinyl-fs](https://github.com/wearefractal/vinyl-fs). The original rationale for this project can be found [here](https://github.com/rnbwd/chronic/blob/master/RATIONALE.md).

## Why did I put together this library?

Most nodejs build systems and rely on large config files and isolated ecosystems. Webpack, Grunt, Duo (?), Browserify (?), Broccolli (?)... etc. etc. They all have their own semantics about transforms vs loaders vs plugins and how they're integrated into their own systems via 3rd party libraries. My favorite build system is gulp. the idea of 'piping  transform streams' sounds much more appealing than writing a config file. Soon after using gulp (and running into many errors), I realized that gulp was just a thin wrapper over node streams. After looking at the source code, I switched over to another task manager called [bud](https://github.com/azer/bud), running [vinyl-fs](https://github.com/wearefractal/vinyl-fs) under the hood myself (vinyl powers the entire gulp ecosystem), and it just worked better for me, in every way. Apparently bud was written on airplane  10 months ago (at the time of writing this), and hasn't been touched since.

So after 6 months of using bud with consistent results, I decided dive into the internals and figure out how he built such a simple program in a few hours that felt superior to what gulp's been using for well over a year. I noticed some *interesting* programming techniques I'd never seen before in javascript. First  I noticed that he wrote these functions designed to handle arbitrary parameters, *arbitrarily*, including *chained methods of itself*. The main export of this library acts just like `gulp.task`, but also accepts params which are chained methods of itself (like the ouroboros eating it's tail). Most of the internal structure is based off a library azer wrote called [new-struct](https://github.com/azer/new-struct), which is a novel class-structure inspired by Go.

Another pattern I noticed was his use of processes (next-tick) / stdin / stdout to control the flow. He basically leveraged unix / shell to handle the tasks instead of designing his own complicated error-prone system purely in nodejs - but at the same time what he wrote *is purely nodejs*. Simple. Very few lines of code. And it's seamless to write command line functions intertwined with your nodjes gulp plugins if you so choose. It all uses the same API. You don't have to choose between nodejs pipes and config files and command line - *you can have all three at the same time*.

So why am I rewriting it (and not using gulp)? Gulp got one problem fundamentally wrong, and its this: **file IO, including watching, should be declared at the highest level possible in the system** - `gulp.src` and `gulp.watch` shouldn't exist inside task functions.  Bud, on the other hand, it's just a tiny library that does one thing well (and it's good), but it's like a tool box without that many tools. I want to put as many useful tools in here as I can fit (the ones I use everyday, like vinyl-source-stream with browserify). Also, node pipes are notorious bad at error handling, so I included some 'fixes' to help with that. I'm currently rewriting the API in es6 (half the original methods seem to be es6 hacks), but it'll be nice to have a standard to build on top of. Enjoy!!

## Usage

Please read the [CHANGELOG](https://github.com/rnbwd/chronic/blob/master/CHANGELOG.md)

``` js
var chron = require('chronic');

chron('default', chron.after('task2'), function(t) {
  t.exec('echo dat {bud}!', t.params);
});

chron('task1', chron.source('./one/**').dest('./two'), chron.build)

chron('task2', chron.after('task1'), tasktwo);

function tasktwo(t) {
  t.build(t.src('./two/**'), t.dest('./three'));
}
```
- Run:

```bash
$ node <filename> --bud=chronic
```

- Should run 'task1', 'task2', then 'default' in that order, returning this output:

```bash
  default  Running...
  task2    Running...
  task1    Running...
  task1    Completed in 6ms
  task2    Completed in 7ms
  default  Executing "echo dat chronic!"
  default  dat chronic!
  default  Completed in 10ms
```

### Command Line Usage

- To run tasks:

```bash
$ node <filename> <tasks> <params>
```

- to watch files:

```bash
$ node <filename> -w # or --watch
```

- to list available tasks in a file:

```bash
$ node <filename> -l # or --list
```

## API

### chronic(task, [opts, func])

* `task` a string used to name tasks.
* `opts` a chainable series chronic methods.
* `func` a function that contains the paramater `t`, optionally use [chronic.build](#chronicbuild)

#### opts:

* `chronic.after` a comma separated list of tasks (strings)
  - list of tasks that should be *run and completed* prior calling `func`
  - may be used without `func` eg: `chron('default', chron.after('task'))`
* `chronic.source` an array or commma separated list of globby strings passed to `vinyl.src` (see [globby](https://github.com/sindresorhus/globby))
  - passed down to `t.src()` and `t.files`
* `chronic.dest` a single string
  - passed down to `t.dest()` and  `t.path`
* `chronic.watch` an array or commma separated list of globby strings to watch (see [globby](https://github.com/sindresorhus/globby))
  - passed down to `t.watching`
* `chronic.transform` a comma separated list of functions that are stream transforms
  - these functions are piped inbetween `t.src` and `t.dest` if `chronic.build` is used
  - only gulp-plugins can safely be used at the moment


#### *func(* **t** *)* :

* `t.done` - callback which determines if a task has completed
  - optionally pass in an error `t.done([err])`
* `t.src` - returns `vinyl.src` *(gulp.src)*
  - if `chronic.source` is defined, calling `t.src()` is populated with the content of `t.files`
  - this can be easily overridden by defining `t.src('glob')` manually
* `t.dest` - returns `vinyl.dest` *(gulp.dest)*
  - if `chronic.dest` is defined, calling `t.dest()` is populated with the content of `t.path`
  - this can also be overriden
* `t.build` - returns an instance of [pump](https://github.com/mafintosh/pump) that calls `t.done` upon completion or error of stream
  - example: `t.build(t.src(), t.dest())`
* `t.exec` - returns formatted [npm-execspawn](https://github.com/mafintosh/npm-execspawn) calling `t.done()` upon completion
  - uses [format-text](https://www.npmjs.com/package/format-text) instead of looking for env variables
  - example: `t.exec('echo hello {place}!', {place: 'world'})`

------

* `t.params` - paramaters returned from command line
* `t.files` - returns an array of strings from `chronic.source`
* `t.path` - returns an array of strings from `chronic.dest`
* `t.watching` - returns an array of files from `chronic.watch`
   - used internally to watch files being watched,
* `t.source` - returns [vinyl-source-stream](https://www.npmjs.com/package/vinyl-source-stream)
* `t.buffer` - return [vinyl-buffer](https://www.npmjs.com/package/vinyl-buffer)
* `t.pump` - returns [pump](https://www.npmjs.com/package/pump)
* `t.eos` - returns [end-of-stream](https://www.npmjs.com/package/end-of-stream)

#### chronic.build

- returns `function(t)` with `pump(t.src(), -> [transforms], -> t.dest())`, returning `t.done` upon completion or error
- this method is syntactical sugar over the most common use pattern of this library


## TODO

 - More examples and tests

 - integrate some philosophy and modules from [folktale](http://docs.folktalejs.org/en/latest/index.html#) - specifically [data.task](https://github.com/folktale/data.task)

> The Task(a, b) structure represents values that depend on time. This allows one to model time-based effects explicitly, such that one can have full knowledge of when they're dealing with delayed computations, latency, or anything that can not be computed immediately.

- [maxogen/atomic-queue](https://github.com/maxogden/atomic-queue) to persist the state / order of tasks if it crashes

> a crash friendly queue that persists queue state and can restart. uses a worker pool and has configurable concurrency

- ast-trees / transform plugin / code analysis bridges into the filesystem. This can all be done in gulp / webpack of course, but I want to find the right plugins and put them in where appropriate (I'm more of a tool finder than builder).

- long term goal... build-system IDE - file system visualizer - npm repo gui / easy download config for all build systems - and to fully leverage these AST transforms being used by everyone to visually and interactively compose complex systems that currently resides in our short term memory.

## License

MIT
