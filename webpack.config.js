const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

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
	plugins: [
		new StartServerPlugin('server.js'),
		new webpack.HotModuleReplacementPlugin(),
	],
	stats: {
		modules: false,
		hash: false,
		version: false,
		colors: true,
		assets: false,
	},
};
