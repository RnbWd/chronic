# chronic 

*adjective*: from Greek *khronikos* ‘of time,’ from *khronos* ‘time.’

[![NPM](https://nodei.co/npm/chronic.png)](https://nodei.co/npm/chronic/)

[![Build Status](https://img.shields.io/travis/codingalchemy/chronic.svg?style=flat-square)](https://travis-ci.org/codingalchemy/chronic)
[![Dependency Status](https://img.shields.io/david/codingalchemy/chronic.svg?style=flat-square)](https://david-dm.org/codingalchemy/chronic)
[![Stability Status](https://img.shields.io/badge/stability-unstable-orange.svg?style=flat-square)](https://github.com/dominictarr/stability#experimental)


```bash
npm install chronic --save-dev
```

## Background

My goal is to provide a balance between *configuration and customization* through the creation of *task-transducers*. This library is now a heavily modified version of azer's [bud](https://github.com/azer/bud) and gulp's [vinyl-fs](https://github.com/wearefractal/vinyl-fs). Rationale for this project can be found [here](https://github.com/codingalchemy/chronic/blob/master/RATIONALE.md).
*The API internals of this libary are very much in flux and subject to change*

## Usage

``` js
var chron = require('chronic');

chron('default', chron.once('task2'), function(t) {
  t.exec('echo dat {bud}!', t.params);
});

chron('task1', chron.path('./one/**').dest('./two'), chron.build)

chron('task2', chron.once('task1'), tasktwo);

function tasktwo(t) {
  t.build(t.src('./two/**'), t.dest('./three'));
}
```
- Run:

```bash
$ node [filename] --bud=chronic
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
$ node <filename> <tasks> [params]
```

- to watch files:

```bash
$ node [filename] -w # or --watch
```

- to list available tasks in a file, pass -l or --list:

```bash
$ node [filename] -l # or --list
```

## API

### chronic(task, opts, [func])

* `task` a string used to name tasks. 
* `opts` a chainable series chronic methods. 
* `func` a function that contains the paramater `t`, optionally use `chronic.build`

#### opts:

* `chronic.once` a comma separated list of tasks (strings)
  - list of tasks that should be *run and completed* prior calling `func` 
  - `chronic.follow` or `chronic.after` can also be used
* `chronic.path` an array or commma separated list of globs (see [globby](https://github.com/sindresorhus/globby))
  - passed down to `t.path`, `t.src()`
* `chronic.dest` a single string 
  - passed down to `t.dest()`
* `chronic.watch` an array or commma separated list of globs (see [globby](https://github.com/sindresorhus/globby))
  - passed down to `t.watching` and `t.files`
* `chronic.transform` a comma separated list of functions that are stream transforms
  - these functions are piped inbetween `t.src` and `t.dest` if `chronic.build` is used
  - only gulp-plugins can safely be used at the moment 


#### *func(* **t** *)* :

**Priority methods**

* `t.done` - callback which determines if a task has completed
  - optionally pass in an error `t.done([err])`
* `t.src` - returns `vinyl.src` *(gulp.src)*
  - if `chronic.path` is defined, calling `t.src()` is populated with the content of `chronic.path` 
  - this can be easily overridden by defining `t.src('glob')` manually
* `t.dest` - returns `vinyl.dest` *(gulp.dest)*
  - if `chronic.dest` is defined, calling `t.dest()` is populated with the content of `chronic.dest`
  - this can also be overriden 
* `t.build` - returns an instance of [pump](https://github.com/mafintosh/pump) that calls `t.done` upon completion or error of stream
  - example: `t.build(t.src(), t.dest())`
* `t.exec` - returns formatted [npm-execspawn](https://github.com/mafintosh/npm-execspawn) calling `t.done()` upon completion
  - uses [format-text](https://www.npmjs.com/package/format-text) instead of looking for env variables
  - example: `t.exec('echo hello {place}!', {place: 'world'})`

**Helper methods**

* `t.params` - paramaters returned from command line
* `t.path` - returns the contents of `chronic.path`
* `t.watching` - returns contents of `chronic.watch` 
* `t.files` - returns an array of files from t.watching
   - used internally to watch files being watched, 
* `t.source` - returns [vinyl-source-stream](https://www.npmjs.com/package/vinyl-source-stream)
* `t.buffer` - return [vinyl-buffer](https://www.npmjs.com/package/vinyl-buffer)
* `t.pump` - returns [pump](https://www.npmjs.com/package/pump)
* `t.eos` - returns [end-of-stream](https://www.npmjs.com/package/end-of-stream)

#### chronic.build

- returns `function(t)` with `pump(t.src(), -> [transforms], -> t.dest())`, returning `t.done` upon completion or error
- this method is syntactical sugar over the most common use pattern of this library


## TODO

More examples and tests and stuff coming soon!!

## License

MIT
