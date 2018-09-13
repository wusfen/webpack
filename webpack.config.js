const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production', // --mode=production webpack 4+ 压缩输出
  entry: [ // 打包入口，一个入口对应一个包
    './src/index.js',
    './src/print.js',
  ],
  output: {
    filename: '[name].js____[hash:5].js', // 输出包[entry.name]
    chunkFilename: '[name].js____.[hash:5].js',
    path: path.resolve(__dirname, 'dist'), // 输出位置
    sourceMapFilename: "sourcemaps/[file].map", // sourcemap 路径
    // publicPath: './', // webpack-dev-middleware -> express
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', // css文本转成<style>放到<head>
          'css-loader', // css文件转成文本
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader', // 加载图片文件返回uri
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']), // 删除 dist文件夹
    new HtmlWebpackPlugin({ // 生成 dist/index.html
      title: 'Output Management'
    }),
    new webpack.NamedModulesPlugin(), // 模块热替换
    new webpack.HotModuleReplacementPlugin(), // 模块热替换
  ],
  devtool: 'source-map', // source map
  devServer: { // webpack-dev-server
    // contentBase: './dist',
    hot: true, // 模块热替换
    historyApiFallback: true, // 404->index.html
  },
  // performance: {
  //   // hints: false, // 判断警告提示
  // }
};