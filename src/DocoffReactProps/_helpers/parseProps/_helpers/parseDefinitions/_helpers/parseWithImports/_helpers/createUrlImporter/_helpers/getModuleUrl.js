import { RESOLVE_EXTENSIONS } from '../../../constants';

/**
 * @param {string} source What is imported, e.g. `./Button.types` or `@scope/package/src/components/Button`
 * @param {string} filename The URL of the file with the import
 * @param {Object} resolvePackages The URLs of the packages to resolve by the names of the packages
 * @returns {string|null} The URL of the import, typically without file extension. `null` when the import
 *   is not to be resolved.
 */
export const getModuleUrl = (source, filename, resolvePackages) => {
  if (source.startsWith('.')) {
    return new URL(source, filename).href;
  }

  const packageName = Object.keys(resolvePackages)
    .sort((nameA, nameB) => nameB.length - nameA.length)
    .find((name) => source === name || source.startsWith(`${name}/`));
  if (!packageName) {
    return null;
  }

  const packageUrl = resolvePackages[packageName];

  // A file contains everything the package exports, so it is used regardless of the imported path. Its URL can have
  // a query string or a fragment, e.g. `library.d.ts?v=1`.
  return RESOLVE_EXTENSIONS.some((extension) => new URL(packageUrl, filename).pathname.endsWith(extension))
    ? packageUrl
    : `${packageUrl.replace(/\/$/, '')}${source.slice(packageName.length)}`;
};
