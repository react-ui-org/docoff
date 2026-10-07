import { getTypeName } from './_helpers/getTypeName';
import { removeReactNamespace } from './_helpers/removeReactNamespace';
import { unifyQuotes } from './_helpers/unifyQuotes';

/**
 * Unifies how the types are described, so that they are presented the same way regardless of how they are written
 * and where they come from, e.g. source files or bundled type declarations: types of React are described without
 * the namespace and string literals are in single quotes.
 *
 * @param {*} value The type as described by `react-docgen`, or any part of it
 * @returns {*} The same value with the types unified
 */
export const normalizeType = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeType);
  }

  if (value === null || typeof value !== 'object') {
    return value;
  }

  return {
    ...Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeType(item)])),
    ...(typeof value.name === 'string' && { name: getTypeName(value) }),
    ...(typeof value.raw === 'string' && { raw: removeReactNamespace(value.raw) }),
    ...(value.name === 'literal' && { value: unifyQuotes(value.value) }),
  };
};
