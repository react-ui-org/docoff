import { removeReactNamespace } from './removeReactNamespace';

/**
 * @param {Object} tsType The type as described by `react-docgen`, which joins the `React` namespace with the name
 *   of the type, e.g. `React.ReactNode` is named `ReactReactNode`
 * @returns {string} The name of the type without the `React` namespace
 */
export const getTypeName = (tsType) => (
  tsType.raw?.startsWith('React.') ? tsType.name.replace(/^React/, '') : removeReactNamespace(tsType.name)
);
