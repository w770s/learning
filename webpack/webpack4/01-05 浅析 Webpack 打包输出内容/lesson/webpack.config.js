const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		main: './src/router.js'
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
}
