import { findExportedValue } from './_helpers/findExportedValue';
import { getModuleUrl } from './_helpers/getModuleUrl';
import { setUniqueTypeName } from './_helpers/setUniqueTypeName';

/**
 * Creates `react-docgen` importer that resolves relative imports and imports from the given packages as URLs.
 * It does the same job as `fsImporter` of `react-docgen`, which is not available in browser as it reads the imported
 * files from the file system.
 *
 * The importer must be synchronous, so it cannot download the imported files itself. It only uses the files that have
 * already been downloaded and reports the missing ones.
 *
 * @param {Map} modules The downloaded files by URL of the import, `null` if the file could not be downloaded
 * @param {Set} missingModuleUrls The URLs of the imports that have not been downloaded yet, filled in by the importer
 * @param {Object} resolvePackages The URLs of the packages to resolve by the names of the packages
 * @returns {Function} The importer
 */
export const createUrlImporter = (modules, missingModuleUrls, resolvePackages) => {
  let importedTypesCount = 0;

  const resolveImportedValue = (path, name, file, seen = new Set()) => {
    const source = path.node.source?.value;
    const { filename } = file.opts;

    const moduleUrl = source && filename ? getModuleUrl(source, filename, resolvePackages) : null;
    if (moduleUrl === null) {
      return null;
    }

    if (!modules.has(moduleUrl)) {
      missingModuleUrls.add(moduleUrl);
      return null;
    }

    // Prevent recursive imports. A file is searched once for each name, as it can be searched for another name later,
    // e.g. `export * from './Card.types'` followed by `export type { Props as CardProps } from './Card.types'`.
    const importedModule = modules.get(moduleUrl);
    const searchedExport = importedModule && `${importedModule.url}:${name}`;
    if (importedModule === null || seen.has(searchedExport)) {
      return null;
    }
    seen.add(searchedExport);

    if (!importedModule.file) {
      importedModule.file = file.parse(importedModule.code, importedModule.url);
    }

    const resultPath = findExportedValue(importedModule.file, name, seen, resolveImportedValue);
    if (resultPath) {
      importedTypesCount += 1;
      setUniqueTypeName(resultPath, importedTypesCount);
    }

    return resultPath;
  };

  return resolveImportedValue;
};
