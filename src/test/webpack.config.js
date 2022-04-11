// @ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebPackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');


const pathToPublic = path.resolve(__dirname, '..', '..', 'public');

/** @type { import( 'webpack' ).Configuration & { devServer: import('webpack-dev-server').Configuration } } */
const config = {
  mode: 'development',
  entry: {
    main: path.join(__dirname, 'index.tsx'),
  },
  devServer: {
    historyApiFallback: true,
    port: 3001,
    compress: true,
    hot: true,
  },
  output: {
    path: pathToPublic,
    filename: '[name].js',
    publicPath: '/',
    pathinfo: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    symlinks: true,
    cacheWithContext: false,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
          experimentalWatchApi: true,
          onlyCompileBundledFiles: true,
        },
      },
      // {
      //   test: /\.css$/i,
      //   use: ['style-loader', 'css-loader'],
      // },
    ],
  },
  devtool: 'eval',
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebPackPlugin(),
  ],
};

module.exports = config;
