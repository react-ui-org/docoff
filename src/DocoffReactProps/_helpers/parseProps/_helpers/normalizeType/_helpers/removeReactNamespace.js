// The `React` namespace including its alias in bundled type declarations, e.g. `React$1.ReactNode`
const REACT_NAMESPACE_REGEX = /\bReact(\$\d+)?\./g;

/**
 * @param {string} text The type as it is written, or its name
 * @returns {string} The text without the `React` namespace, e.g. `ReactNode` instead of `React.ReactNode`
 */
export const removeReactNamespace = (text) => text.replace(REACT_NAMESPACE_REGEX, '');
