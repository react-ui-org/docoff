import { parseDefinitions } from './parseDefinitions';

/**
 * @param {string} source The source code of the file
 * @param {string} url The absolute URL of the file
 * @param {string} name The name of the component
 * @param {Object} resolvePackages The URLs of the packages to resolve by the names of the packages
 * @param {Object} relativeImportUrls The URLs of the files to look up relative imports in, by the URLs of the files
 *   with the imports
 * @param {Map} modules The files that have already been downloaded by their URL, filled in with the imported files
 * @returns {Promise<Object|null>} The component as described by `react-docgen`, `null` when the file has no
 *   component of that name
 */
export const findComponent = async (source, url, name, resolvePackages, relativeImportUrls, modules) => {
  const definitions = await parseDefinitions(source, url, resolvePackages, relativeImportUrls, modules);

  return definitions.find((definition) => definition.displayName === name) ?? null;
};
