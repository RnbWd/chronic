const Options = require('./options');

module.exports = {
after: function () {
  return Options.New({
    after: Array.prototype.slice.call(arguments)
  })
},
source: function () {
  return Options.New({
    source: Array.prototype.slice.call(arguments)
  })
},
watch: function () {
	return Options.New({
    watch: Array.prototype.slice.call(arguments)
  })
},
dest: function () {
  return Options.New({
    dest: Array.prototype.slice.call(arguments)
  })
}
}
