const Path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => ({
  devServer: {
    headers: {},
    historyApiFallback: true,
    static: Path.join(__dirname, 'public'),
  },
  devtool: argv.mode === 'development'
      ? 'eval-cheap-module-source-map'
      : false,
  entry: {
    bundle: [
      Path.join(__dirname, 'node_modules/@ungap/custom-elements'),
      Path.join(__dirname, 'src/main.js'),
    ]
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        use: [{ loader: 'babel-loader' }],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      minify: TerserPlugin.uglifyJsMinify,
    })],
  },
  output: {
    filename: '[name].js?v=__ASSET_VERSION__',
    path: Path.join(__dirname, 'public/generated'),
    publicPath: '/generated/',
  },
  resolve: {
    extensions: ['.js'],
    fallback: {
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
      fs: false,
      module: false,
      net: false,
      path: require.resolve('path-browserify'),
      process: require.resolve('process/browser'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development',
      ),
      'process.env.BABEL_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development',
      ),
      'process.env.NODE_DEBUG': 'false',
    }),
    new webpack.ProvidePlugin({
      process: 'process',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]
});
