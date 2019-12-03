const path = require('path');

module.exports = {
	mode: 'production',
	entry: './src/router.js',
	externals: 'lodash',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'library.js',
		library: 'root',
		libraryTarget: 'umd'
	}
}
