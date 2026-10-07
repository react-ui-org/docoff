import { findComponent } from './_helpers/findComponent';
import { findType } from './_helpers/findType';
import { getDefaultValues } from './_helpers/getDefaultValues';
import { normalizeType } from './_helpers/normalizeType';

/**
 * Reads the types of props of the component, or the type itself, exported from the file under the given name.
 *
 * @param {string} source The source code of the file
 * @param {string} url The absolute URL of the file
 * @param {string} name The name of the component or of the type
 * @param {Object} resolvePackages The URLs of the packages to resolve by the names of the packages
 * @returns {Promise<{ defaultValues: Object, types: Object[] }>} The default values of the props by their names,
 *   and the types that define the props as described by `react-docgen`
 */
export const parseProps = async (source, url, name, resolvePackages = {}) => {
  // Files are downloaded once, even when both a component and a type are looked for
  const modules = new Map([[
    url,
    {
      code: source,
      url,
    },
  ]]);
  const definition = await findComponent(source, url, name, resolvePackages, modules)
    ?? await findType(url, name, resolvePackages, modules);

  return {
    defaultValues: getDefaultValues(definition),
    types: normalizeType(definition.propsTypes),
  };
};
