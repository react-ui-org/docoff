const MAX_DEVELOPMENT_OUTPUT_SIZE_BYTES = 11800000;
const MAX_PRODUCTION_OUTPUT_SIZE_BYTES = 1950000;

/** @typedef {import('webpack').Configuration['performance']} WebpackPerformanceConfig */

/**
 * @param {Environment} environment
 * @returns {WebpackPerformanceConfig}
 */
export const performanceConfig = (environment) => {
  const maxOutputSize = environment.WEBPACK_MODE === 'production'
    ? MAX_PRODUCTION_OUTPUT_SIZE_BYTES
    : MAX_DEVELOPMENT_OUTPUT_SIZE_BYTES;

  return {
    hints: 'error',
    maxAssetSize: maxOutputSize,
    maxEntrypointSize: maxOutputSize,
  };
};
