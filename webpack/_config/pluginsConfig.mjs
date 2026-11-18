import webpack from 'webpack';

/** @typedef {import('webpack').Configuration['plugins']} WebpackPluginsConfig */

/**
 * @param {Environment} environment
 * @returns {WebpackPluginsConfig}
 */
export const pluginsConfig = (environment) => [
  new webpack.DefinePlugin({
    'process.env.BABEL_ENV': JSON.stringify(environment.WEBPACK_MODE),
    'process.env.NODE_DEBUG': 'false',
    'process.env.NODE_ENV': JSON.stringify(environment.WEBPACK_MODE),
  }),
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
    process: 'process',
  }),
];
