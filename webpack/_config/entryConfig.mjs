import path from 'path';
import { getRootDirname } from '../_helpers/getRootDirname.mjs';

/** @typedef {import('webpack').Configuration['entry']} WebpackEntryConfig */

/**
 * @returns {WebpackEntryConfig}
 */
export const entryConfig = () => ({
  bundle: [
    path.join(getRootDirname(), 'node_modules/@ungap/custom-elements/index.js'),
    path.join(getRootDirname(), 'src/main.js'),
  ],
});
