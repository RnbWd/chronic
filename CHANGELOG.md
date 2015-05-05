# Changelog

## 1.0.0-alpha.1 [MAJOR BREAKING CHANGES]

* Remove `build` and `transform` methods


## 0.5.0-alpha.1

Rewrote many of the interals of the library to be es6 friendly. Expecting to take advange of more new features soon for FAST - CONSISTENT - SIMPLE task manager.

## 0.4.2

* Upgraded Chokidar

## 0.4.0 [BREAKING CHANGES]

  * API has been finalized, there were some errors with the naming system (or ability to rename methods)
  * The changes are as follows:
    -  `chronic.source` has replaced `chronic.path`
    -  `chronic.after` has replaced `chronic.once`
    -  there are no optional name changes, this is the only way to call those methods
    -  `t.files` contains the content of `chronic.source`
    -  `t.path` contains the content of `chornic.dest`
    -  `t.watching` contains an array of files being watched

  * Everything else is the same, just finalized API

## 0.3.0

* Actually console.warn's errors
* Updated vinyl-fs repository

## 0.2.6

* changed .npmignore (no need to include erroneous cat.jpg or fake-folder when npm installing library)
* changed test folder example to fake-folder

## 0.2.5

* accidentally hit `npm version patch`

## 0.2.4

* enhancement  -- 'watching: ' emits tasks instead of 'glob'
* enhancement -- changed: / watching: are also white

## 0.2.3

* bug-fix  -- 'changed: ' is only emitted once now

## 0.2.2

* `chron.src` may be used for `chron.path` (optional)
* `chron.files` may be used for `chron.watch` (optional)

## 0.2.1

* Updated Readme :)

## 0.2.0

[BREAKING CHANGES]

* `t.exec` calls `t.done()` upon stream completion
* All flags are passed down to `t.params`, and you can no longer pass down non-flagged params.
    - eg: `node <file> -w --bud=chronic --hello-world` --> `t.params == { watch: true, w: true, bud: 'chronic', helloWorld: true }`).
* `t.files` is no longer a function, it's used internally to watch files. Still returns array of files listed under chron.watch('..')
* When watching files, tasks will not re-run unless they are explicitly finished.
    - eg: call `t.done()` or use helper functions like `t.build` or `chron.build`.
* `chron.after` && `chron.follow` are synonyms for `chron.once` (optional)
* Following modules were replaced (but should have minimal impact on usage):
    - [parallel-loop](https://www.npmjs.com/package/parallel-loop) --> [each-async](https://www.npmjs.com/package/each-async)
    - [through](https://www.npmjs.com/package/through) --> [through2](https://www.npmjs.com/package/through2) (if you're not using node > 0.10 (who?) then download [readableStream](https://www.npmjs.com/package/readable-stream))
    - [new-command](https://www.npmjs.com/package/new-command) --> [meow](https://www.npmjs.com/package/meow)
    - [style-format](https://www.npmjs.com/package/style-format) --> [chalk](https://www.npmjs.com/package/chalk)
* Added [vinyl-buffer](https://www.npmjs.com/package/vinyl-buffer) and [end-of-stream](https://www.npmjs.com/package/end-of-stream)


## 0.1.6

* bug fix -- watching only chron.watch(..)

## 0.1.5

* added vinyl-source-stream, accessible as `t.source`
