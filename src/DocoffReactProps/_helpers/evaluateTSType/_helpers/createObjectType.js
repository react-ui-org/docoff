/**
 * @param {Object[]} properties The properties of the object, each with its `key` and `value`
 * @param {string} raw The type as it is written
 * @returns {Object} The object type as described by `react-docgen`
 */
export const createObjectType = (properties, raw) => ({
  name: 'signature',
  raw,
  signature: { properties },
  type: 'object',
});
