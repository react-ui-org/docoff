const Path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const DocoffFunctionDocPlugin = require('./src/_plugins/DocoffFunctionDocPlugin');

const MAX_OUTPUT_SIZE_KB = 1600000;

module.exports = (env, argv) => ({
  devServer: {
    allowedHosts: ['all'],
    headers: {},
    historyApiFallback: true,
    static: Path.join(__dirname, 'public'),

    // This allows loading the `*.js` and `*.wasm` files into other pages thus making development and testing easier
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  devtool: argv.mode === 'development'
      ? 'eval-cheap-module-source-map'
      : false,
  entry: {
    bundle: [
      Path.join(__dirname, 'node_modules/@ungap/custom-elements/index.js'),
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
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  // Disabled, because `uglify-js` causes `react-docgen` to fail in Safari browser
  // optimization: {
  //   minimize: true,
  //   // minimizer: [new TerserPlugin({
  //   //   minify: TerserPlugin.uglifyJsMinify,
  //   // })],
  // },
  output: {
    filename: '[name].js?v=__ASSET_VERSION__',
    path: Path.join(__dirname, 'public/generated'),
    publicPath: '/generated/',
  },
  plugins: [
    new DocoffFunctionDocPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(argv.mode),
      'process.env.BABEL_ENV': JSON.stringify(argv.mode),
      'process.env.NODE_DEBUG': 'false',
    }),
    new webpack.ProvidePlugin({
      process: 'process',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  performance: {
    maxAssetSize: MAX_OUTPUT_SIZE_KB,
    maxEntrypointSize: MAX_OUTPUT_SIZE_KB,
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
});
