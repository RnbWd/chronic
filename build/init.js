'use strict';

var Options = require('./options');

module.exports = {
  after: function after() {
    return Options.New({
      after: Array.prototype.slice.call(arguments)
    });
  },
  source: function source() {
    return Options.New({
      source: Array.prototype.slice.call(arguments)
    });
  },
  watch: function watch() {
    return Options.New({
      watch: Array.prototype.slice.call(arguments)
    });
  },
  dest: function dest() {
    return Options.New({
      dest: Array.prototype.slice.call(arguments)
    });
  }
};