/**
 * @param {Object} tsType The type as described by `react-docgen`
 * @returns {Object} The type the promise resolves to, the type itself when it is not a promise. Each member of
 *   a union is unwrapped on its own.
 */
export const unwrapPromise = (tsType) => {
  if (tsType.name === 'union') {
    return {
      ...tsType,
      elements: tsType.elements.map(unwrapPromise),
    };
  }

  return tsType.name === 'Promise' && tsType.elements ? unwrapPromise(tsType.elements[0]) : tsType;
};
