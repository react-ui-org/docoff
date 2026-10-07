import { resolveUrl } from '../../_helpers/resolveUrl';

/**
 * @param {string} pageUrl The URL of the current page
 * @param {string|undefined} basePath The path the site is deployed at
 * @param {Object|undefined} resolvePackages The URLs of the packages to resolve as they are configured
 * @returns {Object} The absolute URLs of the packages to resolve by the names of the packages
 */
export const getPackageUrls = (pageUrl, basePath, resolvePackages) => Object.fromEntries(
  Object.entries(resolvePackages ?? {}).map(([name, url]) => [name, resolveUrl(pageUrl, basePath, url)]),
);
