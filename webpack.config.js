const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	watch: true,
	target: 'node',
	entry: [path.resolve('./server/index')],
	output: {
		path: path.resolve('.build'),
		filename: 'server.js',
	},
	resolve: {
		modules: [path.resolve('./server'), 'node_modules'],
	},
	externals: [nodeExternals()],
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'eslint-loader',
				options: {
					fix: true,
				},
			},
			{
				test: /\.js?$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
		],
	},
	stats: 'minimal',
};
