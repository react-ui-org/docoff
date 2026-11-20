import path from 'path';
import { getRootDirname } from '../_helpers/getRootDirname.mjs';

/** @typedef {import('webpack-dev-server').Configuration} WebpackDevServerConfig */

/**
 * @returns {WebpackDevServerConfig}
 */
export const devServerConfig = () => ({
  allowedHosts: ['all'],
  // This allows loading the `*.js` and `*.wasm` files into other pages thus making development and testing easier
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  historyApiFallback: true,
  static: path.join(getRootDirname(), 'public'),
});
