# Changelog

## 0.2.3

* bug-fix  -- 'changed: ' is only emitted once now

## 0.2.2

* `chron.src` can be used for `chron.path` (optional)
* `chron.files` can be used for `chron.watch` (optional)

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
* Following modules were replaced (but should have minimal on usage):
    - [parallel-loop](https://www.npmjs.com/package/parallel-loop) --> [each-async](https://www.npmjs.com/package/each-async)
    - [through](https://www.npmjs.com/package/through) --> [through2](https://www.npmjs.com/package/through2) (if you're not using node > 0.10 then download [readableStream](https://www.npmjs.com/package/readable-stream) is required)
    - [new-command](https://www.npmjs.com/package/new-command) --> [meow](https://www.npmjs.com/package/meow)
    - [style-format](https://www.npmjs.com/package/style-format) --> [chalk](https://www.npmjs.com/package/chalk)
* Added [vinyl-buffer](https://www.npmjs.com/package/vinyl-buffer) and [end-of-stream](https://www.npmjs.com/package/end-of-stream)


## 0.1.6

* bug fix -- watching only chron.watch(..)

## 0.1.5

* added vinyl-source-stream, accessible as `t.source`