import * as docgen from 'react-docgen';
import { createUrlImporter } from './_helpers/createUrlImporter';
import { fetchModule } from './_helpers/fetchModule';
import { restoreTypeNames } from './_helpers/restoreTypeNames';

/**
 * Parses the source code including the types it imports from other files.
 *
 * The importer cannot download the imported files as it must be synchronous. Therefore, the source code is parsed
 * repeatedly, each time with the files missing in the previous run downloaded, until no file is missing.
 *
 * @param {string} source The source code
 * @param {string} url The absolute URL of the source file
 * @param {Object} options The options of `react-docgen`
 * @param {Object} resolvePackages The URLs of the packages to resolve by the names of the packages
 * @param {Object} relativeImportUrls The URLs of the files to look up relative imports in, by the URLs of the files
 *   with the imports
 * @param {Map} modules The files that have already been downloaded by their URL
 * @returns {Promise<Object[]>} The components found in the source code as described by `react-docgen`
 */
export const parseWithImports = async (source, url, options, resolvePackages, relativeImportUrls, modules) => {
  const missingModuleUrls = new Set();
  const optionsWithImporter = {
    ...options,
    filename: url,
    importer: createUrlImporter(modules, missingModuleUrls, resolvePackages, relativeImportUrls),
  };

  const parse = async () => {
    const definitions = docgen.parse(source, optionsWithImporter);

    if (missingModuleUrls.size === 0) {
      return restoreTypeNames(definitions);
    }

    const moduleUrls = [...missingModuleUrls];
    missingModuleUrls.clear();
    await Promise.all(moduleUrls.map(async (moduleUrl) => {
      modules.set(moduleUrl, await fetchModule(moduleUrl));
    }));

    return parse();
  };

  return parse();
};
