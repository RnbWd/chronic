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

This library is built on top of azer's [bud](https://github.com/azer/bud) and gulp's [vinyl-fs](https://github.com/wearefractal/vinyl-fs). Rationale for this project can be found [here](https://github.com/codingalchemy/chronic/blob/master/RATIONALE.md).
*The API internals of this libary are very much in flux and subject to change*


## Usage

``` js
var chron = require('chronic');

chron('default', chron.once('task2'), function(t) {
  t.exec('echo hello {name}!"', t.params).then(t.done);
});

chron('task1', chron.src('./one/**').dest('./two'), chron.build)

chron('task2', chron.once('task1'). function(t) {
  t.build(t.src('./two/**'), t.dest('./three'));
});

```
- Run:

```bash
$ node [filename] name=azer
```

- Should return 'task1', 'task2', then 'default':

```bash
  default  Running...
  task2    Running...
  task1    Running...
  task1    Completed in 6ms
  task2    Completed in 15ms
  default  Executing "echo "hello azer!""
  default hello azer!
```

### Command Line Usage

- To run tasks:

```bash
$ node [filename] [tasks] [params]
```

- to list available tasks in a file, pass -l or --list:

```bash
$ node [filename] -l
```

- to see help:

```bash
$ node [filename] -h # or --help
```

## API

### chronic(task, opts, [func])

- `task` a string used to name tasks. 
- `opts` a chainable series chronic methods. 
- `func` a function that contains the paramater `t`, optionally pass in `chronic.build`

#### opts:

- `chronic.once` a comma separated list of strings (tasks)
  - tasks which should be *run and completed* prior to this task starting
- `chronic.path` an array or commma separated list of globs (see [globby](https://github.com/sindresorhus/globby))
  - passed down to `t.src('path')` and `t.files`
- `chronic.watch` an array or commma separated list of globs (see [globby](https://github.com/sindresorhus/globby))
  - passed down to `t.watching` and `t.files`
- `chronic.transform` a comma separated list of functions that are stream transforms
  - these functions are piped inbetween `t.src` and `t.dest` if `chronic.build` is used
  - only gulp-plugins can safely be used at the moment 
- `chronic.dest` a single string 
  - passed down to `t.dest('path')`

#### *func(* **t** *)* :

- `t.done` - callback which determines if a task has completed
  - optionally pass in an error `t.done([err])`
- `t.src` - returns `vinyl.src` *(gulp.src)*
  - if `chronic.path('glob')` is defined, calling `t.src()` is the equivalent of calling `t.src('glob')`
  - this can be easily overridden by defining `t.src('glob')` manually
- `t.dest()` - returns `vinyl.dest` *(gulp.dest)*
  - if `chronic.dest` is defined, calling `t.dest()` is populated with the content of `chronic.dest`
  - this can also be overriden 
- `t.build` - returns an instance of `pump` that calls `t.done` upon completion or error of stream
  - example: `t.build(t.src(), t.dest())`
- `t.exec` - returns formatted [npm-execspawn](https://github.com/mafintosh/npm-execspawn) command
  - looks for local npm dependencies before running command
  - example: `t.exec('echo "hello world!"').then(t.done)`
- `t.params` - paramaters returned from command line
- `t.path` - returns the contents of `chronic.path`
- `t.watching` - returns contents of `chronic.watch` 
- `t.files` - function which returns an array of files
  - `t.files('path')` returns array of files from `chronic.path`
  - `t.files('watching')` returns array of files from `chronic.watch`

#### chronic.build

- returns `function(t)` with `pump(t.src(), -> [transforms], -> t.dest())`, returning `t.done` upon completion or error
- this method is syntactical sugar over the most common use pattern of this library

## License

MIT