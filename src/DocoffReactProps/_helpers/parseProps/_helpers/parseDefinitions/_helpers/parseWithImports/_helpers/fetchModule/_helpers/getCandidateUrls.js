import { RESOLVE_EXTENSIONS } from '../../../constants';

/**
 * @param {string} moduleUrl The URL of the import, typically without file extension
 * @returns {string[]} The URLs of the files the import can point to, sorted by priority
 */
export const getCandidateUrls = (moduleUrl) => {
  if (RESOLVE_EXTENSIONS.some((extension) => new URL(moduleUrl).pathname.endsWith(extension))) {
    return [moduleUrl];
  }

  // The import can point either to a file or to a directory with an index file. Files take precedence, the same
  // way as when the import is resolved by TypeScript.
  return [
    ...RESOLVE_EXTENSIONS.map((extension) => `${moduleUrl}${extension}`),
    ...RESOLVE_EXTENSIONS.map((extension) => `${moduleUrl}/index${extension}`),
  ];
};
