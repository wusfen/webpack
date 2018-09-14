var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var FileManagerPlugin = require('filemanager-webpack-plugin')
var noop = function(){
}

// webpack --env.prod
module.exports = function(env, args){
  console.log('webpack args:', args)
  env = env || {}
  return {
    mode: 'production', // --mode=production webpack 4+ 压缩输出
    // 打包入口
    entry: {
      // 一个入口对应一个包
      // 入口包不能同时是子chunk
      app: './src/index.js',
      print: './src/print.js',
    },
    // 输出配置
    output: env.prod ? {
      filename: '[name].js____[hash:5].js', // 输出包[entry.name] // filename:[chunkhash]不能和热替换插件同用
      chunkFilename: '[name].js____.[hash:5].js',
      path: path.resolve(__dirname, 'dist/assets'), // 输出位置
      sourceMapFilename: "sourcemaps/[file].map", // sourcemap 路径
      publicPath: './assets/', // [index.html]./assets/chunks
    }:{
      // dev
    },
    // 模块加载配置
    module: {
      // loader规则
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
              loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
          }, {
              loader: "sass-loader" // 将 Sass 编译成 CSS
          }]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          loader: 'url-loader', // 加载图片返回 base64
          options: {
            limit: 1024*5, // 超过指定字节，则使用fallback
            fallback: { // 加载图片文件返回uri
              loader: 'file-loader',
              options: {
                name: 'img/[name].[ext]____[hash:5].[ext]',
                name: '[name].[ext]____[hash:5].[ext]',
              }
            },
          },
        }
      ]
    },
    // 插件
    plugins: [
      // 生成 dist/index.html
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: env.prod?
          '../index.html':
          './index.html'
      }),
      // 模块热替换
      !env.prod? new webpack.HotModuleReplacementPlugin(): noop,
      // 删除与打包
      env.prod? new FileManagerPlugin({
        onStart: {
          delete: [
            // 'dist',
            // 'dist/*',
            'dist/index.html',
            'dist/assets/*'
          ],
        },
        onEnd: {
          archive:[{
            source: './dist',
            destination: './dist.zip'
          }]
        }
      }) : noop,
    ],
    // source map
    devtool: 'source-map',
    // 开发服务器 webpack-dev-server
    devServer: {
      hot: true, // 模块热替换
      historyApiFallback: true, // 404->index.html
    },
    // performance: {
    //   // hints: false, // 判断警告提示
    // }
  }
}