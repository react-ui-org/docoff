import path from 'path';
import { getRootDirname } from '../_helpers/getRootDirname.mjs';

/** @typedef {import('webpack').Configuration['output']} WebpackOutputConfig */

/**
 * @returns {WebpackOutputConfig}
 */
export const outputConfig = () => ({
  filename: '[name].js?v=__ASSET_VERSION__',
  path: path.join(getRootDirname(), 'public/generated'),
  publicPath: '/generated/',
});
