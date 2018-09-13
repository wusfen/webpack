const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config.js');

// webpack 自动配置
// --optimize-minimize => UglifyJSPlugin
// --define process.env.NODE_ENV="'production'" => webpack.DefinePlugin
// -p => devtool:'source-map', --optimize-minimize, --define
// mode: 'production' => --define, UglifyJSPlugin, ...

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
  ]
});