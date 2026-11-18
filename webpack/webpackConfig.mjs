import { devServerConfig } from './_config/devServerConfig.mjs';
import { devtoolConfig } from './_config/devtoolConfig.mjs';
import { entryConfig } from './_config/entryConfig.mjs';
import { moduleConfig } from './_config/moduleConfig.mjs';
import { outputConfig } from './_config/outputConfig.mjs';
import { performanceConfig } from './_config/performanceConfig.mjs';
import { pluginsConfig } from './_config/pluginsConfig.mjs';
import { resolveConfig } from './_config/resolveConfig.mjs';

/** @typedef {import('webpack').Configuration} WebpackConfig */

/**
 * @typedef {Object} Environment
 * @property {'development' | 'production'} WEBPACK_MODE
 */

/**
 * @param webpackArgs
 * @returns {WebpackConfig}
 */
export const webpackConfig = (webpackArgs) => {
  /** @type {Environment} */
  const environment = {
    WEBPACK_MODE: webpackArgs.mode || 'development',
  };

  // `optimization` is not set. The default minimizer is used, as `uglify-js` causes `react-docgen` to fail
  // in Safari browser.
  return ({
    devServer: devServerConfig(),
    devtool: devtoolConfig(environment),
    entry: entryConfig(),
    module: moduleConfig(),
    output: outputConfig(),
    performance: performanceConfig(),
    plugins: pluginsConfig(environment),
    resolve: resolveConfig(),
  });
};
