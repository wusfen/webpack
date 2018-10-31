/*
cnpm i -D
  webpack webpack-cli
    style-loader css-loader
    less-loader less
    postcss-loader autoprefixer
    url-loader file-loader
    babel-loader @babel/core @babel/preset-env
    vue-loader vue-template-compiler vue
  html-webpack-plugin
  filemanager-webpack-plugin
  webpack-dev-server
*/
/*
  "dev": "webpack-dev-server --config webpack.config.js --mode development",
  "open": "webpack-dev-server --open --config webpack.config.js --mode development",
  "build": "webpack --env.prod --config webpack.config.js --progress",
*/

var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FileManagerPlugin = require('filemanager-webpack-plugin')
var VueLoaderPlugin = require('vue-loader/lib/plugin')
var noop = function () { }

// webpack --env.prod
module.exports = function (env, args) {
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
      sourceMapFilename: 'sourcemaps/[file].map', // sourcemap 路径
      publicPath: './assets/', // [index.html]./assets/chunks
    } : {
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
              // presets: ['@babel/preset-env'],
              // plugins: ['@babel/transform-runtime']
            }
          }
        },
        {
          test: /\.coffee$/,
          use: ['coffee-loader']
        },
        {
          test: /\.vue$/,
          use: ['vue-loader']
        },
        {
          test: /\.css$/,
          use: [
            'style-loader', // css文本转成<style>放到<head>
            'css-loader', // css文件转成文本
            'postcss-loader',
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'less-loader',
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ]
        },
        {
          test: /\.(gif|jpg|jpeg|png|woff|svg|eot|ttf)\??.*$/,
          loader: 'url-loader', // 加载图片返回 base64
          options: {
            limit: 5 * 1024, // 超过指定字节，则使用fallback
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
      new VueLoaderPlugin,
      // 生成 dist/index.html
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: env.prod ?
          '../index.html' :
          './index.html' // 热替换貌似只能跟资源在同层级目录
      }),
      // 模块热替换
      !env.prod ? new webpack.HotModuleReplacementPlugin() : noop,
      // 删除与打包
      env.prod ? new FileManagerPlugin({
        onStart: {
          delete: [
            // 'dist',
            // 'dist/*',
            'dist/index.html',
            'dist/assets/*'
          ],
        },
        onEnd: {
          archive: [{
            source: './dist',
            destination: './dist.zip'
          }]
        }
      }) : noop,
    ],
    // source map
    // devtool: 'source-map',
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