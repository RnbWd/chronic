# chronic 

*adjective*: from Greek *khronikos* ‘of time,’ from *khronos* ‘time.’

[![NPM](https://nodei.co/npm/chronic.png)](https://nodei.co/npm/chronic/)

[![Build Status](https://img.shields.io/travis/codingalchemy/chronic.svg?style=flat-square)](https://travis-ci.org/codingalchemy/chronic)
[![Dependency Status](https://img.shields.io/david/codingalchemy/chronic.svg?style=flat-square)](https://david-dm.org/codingalchemy/chronic)

```bash
npm install chronic --save-dev
```

## Background

This library is built on top of azer's [bud](https://github.com/azer/bud) and gulp's [vinyl-fs](https://github.com/wearefractal/vinyl-fs). Rationale for this project can be found [here](https://github.com/codingalchemy/chronic/blob/master/RATIONALE.md).


## Usage

``` js
var chron = require('chronic');
var del = require('del');

chron('first task', chron.src('./one/**').dest('./two'), chron.build)

chron('another task', chron.once('first task'). function(t) {
  t.build(t.src('./two/**'), t.dest('./three'));
});

chron('del', chron.once('another task'), function(t) {
  del('./one', t.done);
});


```

## API

### chronic(tasks)




## License

MIT