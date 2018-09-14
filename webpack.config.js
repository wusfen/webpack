const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = function(env, args){
  env = env || {}
  return {
    mode: 'production', // --mode=production webpack 4+ 压缩输出
    entry: { // 打包入口
      // 一个入口对应一个包
      // 入口包不能同时是子chunk
      app: './src/index.js',
      // print: './src/print.js',
    },
    output: env.prod?
    {
      filename: '[name].js____[hash:5].js', // 输出包[entry.name] // filename:[chunkhash]不能和热替换插件同用
      chunkFilename: '[name].js____.[hash:5].js',
      path: path.resolve(__dirname, 'dist/assets'), // 输出位置
      sourceMapFilename: "sourcemaps/[file].map", // sourcemap 路径
      publicPath: './assets/', // [index.html]./assets/chunks
    }:{

    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/transform-runtime']
            }
          }
        },
        {
          test: /\.coffee$/,
          use: [ 'coffee-loader' ]
        },
        {
          test: /\.css$/,
          use: [
            'style-loader', // css文本转成<style>放到<head>
            'css-loader', // css文件转成文本
          ]
        },
        {
          test: /\.less$/,
          use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "less-loader" // compiles Less to CSS
          }]
        },
        {
          test: /\.scss$/,
          use: [{
              loader: "style-loader" // 将 JS 字符串生成为 style 节点
          }, {
              loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
          }, {
              loader: "sass-loader" // 将 Sass 编译成 CSS
          }]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          loader: 'url-loader', // 加载图片返回 base64
          options: {
            limit: 1024*5, // 超过指定字节，则使用fallback
            fallback: 'file-loader', // 加载图片文件返回uri
          },
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['dist/*']), // 清空 dist文件夹
      new HtmlWebpackPlugin({ // 生成 dist/index.html
        filename: env.prod?'../index.html':'./index.html'
        // title: 'html title'
      }),
      env.prod?, '',new webpack.HotModuleReplacementPlugin(), // 模块热替换
    ],
    devtool: 'source-map', // source map
    devServer: { // webpack-dev-server
      // contentBase: './dist',
      // publicPath: '',
      hot: true, // 模块热替换
      historyApiFallback: true, // 404->index.html
    },
    // performance: {
    //   // hints: false, // 判断警告提示
    // }
  }
}