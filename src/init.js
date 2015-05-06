const Options = require('./options');

module.exports = {
	after: (...args) => (
		Options.New({
			after: args
		})
	),
	source: (...args) => (
		Options.New({
			source: args
		})
	),
	watch: (...args) => (
		Options.New({
			watch: args
		})
	),
	dest: (...args) => (
		Options.New({
			dest: args
		})
	)
}
