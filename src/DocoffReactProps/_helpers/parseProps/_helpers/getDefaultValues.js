/**
 * @param {Object} definition The component as described by `react-docgen`
 * @returns {Object} The default values of props by the names of the props
 */
export const getDefaultValues = (definition) => Object.fromEntries(
  Object.entries(definition.props ?? {})
    .filter(([, prop]) => prop.defaultValue)
    .map(([name, prop]) => [name, prop.defaultValue.value]),
);
