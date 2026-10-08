import * as docgen from 'react-docgen';
import { adjustTypesPlugin } from './_helpers/adjustTypesPlugin';
import { parseWithImports } from './_helpers/parseWithImports';
import { propsTypeHandler } from './_helpers/propsTypeHandler';

/**
 * Finds the components in the source code and describes them including the types of their props.
 *
 * @param {string} source The source code
 * @param {string} url The absolute URL of the source file
 * @param {Object} resolvePackages The URLs of the packages to resolve by the names of the packages
 * @param {Object} relativeImportUrls The URLs of the files to look up relative imports in, by the URLs of the files
 *   with the imports
 * @param {Map} modules The files that have already been downloaded by their URL
 * @returns {Promise<Object[]>} The components as described by `react-docgen`, each with `propsTypes`
 */
export const parseDefinitions = async (source, url, resolvePackages, relativeImportUrls, modules = new Map()) => {
  const options = {
    babelOptions: {
      // The source code is parsed on its own, Babel config files must never be looked up
      babelrc: false,
      configFile: false,
      parserOpts: {
        plugins: ['typescript', 'jsx'],
      },
      plugins: [adjustTypesPlugin],
    },
    handlers: [...docgen.defaultHandlers, propsTypeHandler],
    resolver: new docgen.builtinResolvers.FindAllDefinitionsResolver(),
  };

  try {
    return await parseWithImports(source, url, options, resolvePackages, relativeImportUrls, modules);
  } catch (error) {
    // A file with no component, e.g. a file with types only, is not an error
    if (error.code === docgen.ERROR_CODES.MISSING_DEFINITION) {
      return [];
    }

    throw error;
  }
};
