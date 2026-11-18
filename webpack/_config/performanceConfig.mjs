const MAX_OUTPUT_SIZE_BYTES = 1600000;

/** @typedef {import('webpack').Configuration['performance']} WebpackPerformanceConfig */

/**
 * @returns {WebpackPerformanceConfig}
 */
export const performanceConfig = () => ({
  maxAssetSize: MAX_OUTPUT_SIZE_BYTES,
  maxEntrypointSize: MAX_OUTPUT_SIZE_BYTES,
});
