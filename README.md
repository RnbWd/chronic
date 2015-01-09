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

chron('first task', chron.src('./one/**').dest('./two'), chron.build)

chron('another task', chron.once('first task'). function(t) {
  t.build(t.src('./two/**'), t.dest('./three'));
});

chron('default', chron.once('another task'), function(t) {
  t.done();
});


```

## API

### chronic(task, opts, [func])

- `task` a string, works similarly to `gulp.task('task', function(..))`. Used to name tasks. 
- `opts` a chainable series chronic methods. 
- `func` a function that contains the paramater `t`

#### opts:

- `chronic.once` a comma separated list of strings (tasks)
  - tasks which should be *run and completed* prior to this task starting
- `chronic.path` a glob of string(s), either in an array or commma separated
  - passed down to `t.src('path')` and `t.files`
- `chronic.watch` a glob of string(s), either in an array or commma separated
  - passed down to `t.watching` and `t.files`
- `chronic.transform` a comma separated list of functions that are stream transforms
  - these functions are piped inbetween `t.src` and `t.dest` using [pump](https://github.com/mafintosh/pump)
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
- `t.combine` - returns an instance of `pump` that automatically calls `t.done` upon completion or error of stream
  - example: `t.combine(t.src(), t.dest())`
- `t.build` - returns an instance of `pump` that calls `t.done` upon completion with syntactical sugar of the example above
  - 
- `t.path` - contains the contents of `chronic.path`
- `t.watching` - returns content of `chronic.watch` 
- `t.files(['path' | 'watching'])` - returns an array of files

## License

MIT