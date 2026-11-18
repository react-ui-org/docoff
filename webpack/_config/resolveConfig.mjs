import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @typedef {import('webpack').Configuration['resolve']} WebpackResolveConfig */

/**
 * @returns {WebpackResolveConfig}
 */
export const resolveConfig = () => ({
  extensions: ['.js'],
  // Node.js core modules that the bundled packages import have to be replaced in the browser
  fallback: {
    assert: require.resolve('assert/'),
    buffer: require.resolve('buffer/'),
    fs: false,
    module: false,
    net: false,
    path: require.resolve('path-browserify'),
    process: require.resolve('process/browser'),
  },
});
