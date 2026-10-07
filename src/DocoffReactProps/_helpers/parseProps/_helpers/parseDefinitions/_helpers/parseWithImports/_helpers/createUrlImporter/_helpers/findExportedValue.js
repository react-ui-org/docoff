import { utils } from 'react-docgen';
import { getOriginalTypeName } from '../../getOriginalTypeName';

/**
 * Finds the value exported from the file under the given name.
 *
 * @param {Object} file The parsed file, `FileState` of `react-docgen`
 * @param {string} name The name of the export
 * @param {Set} seen The files that have already been searched, each with the name it was searched for
 * @param {Function} resolveImportedValue The importer, used to follow the values exported from other files
 * @returns {Object|null} The path to the exported value, `null` when it is not found
 */
export const findExportedValue = (file, name, seen, resolveImportedValue) => {
  let resultPath = null;

  file.traverse({
    ...utils.traverse.shallowIgnoreVisitors,
    ExportAllDeclaration: {
      enter: (path) => {
        // export * from '…'
        resultPath = resolveImportedValue(path, name, file, seen);

        if (resultPath) {
          path.stop();
        } else {
          path.skip();
        }
      },
    },
    ExportDefaultDeclaration: {
      enter: (path) => {
        if (name === 'default') {
          resultPath = path.get('declaration');
          path.stop();
        } else {
          path.skip();
        }
      },
    },
    ExportNamedDeclaration: {
      enter: (path) => {
        const declaration = path.get('declaration');

        if (declaration.hasNode() && declaration.isVariableDeclaration()) {
          // export const/var …
          const declarator = declaration
            .get('declarations')
            .find((declaratorPath) => declaratorPath.get('id').isIdentifier({ name }));

          if (declarator && declarator.get('init').hasNode()) {
            resultPath = declarator.get('init');
          }
        } else if (declaration.hasNode()) {
          // export function/class/type/interface/enum …
          // Types that have already been imported have unique names
          if (declaration.has('id') && getOriginalTypeName(declaration.node.id.name) === name) {
            resultPath = declaration;
          }
        } else {
          // export { … } or export { … } from '…'
          const specifier = path
            .get('specifiers')
            .find((specifierPath) => (
              !specifierPath.isExportNamespaceSpecifier()
              && specifierPath.get('exported').isIdentifier({ name })
            ));

          if (specifier && path.has('source')) {
            const localName = specifier.isExportSpecifier() ? specifier.node.local.name : 'default';
            resultPath = resolveImportedValue(path, localName, file, seen);
          } else if (specifier) {
            resultPath = specifier.get('local');
          }
        }

        if (resultPath) {
          path.stop();
        } else {
          path.skip();
        }
      },
    },
  });

  return resultPath;
};
