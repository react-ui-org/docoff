/*
 * Determines which of the propType definitions of the base component should be used
 * @param {Object} basePropTypes The propTypes of the base component
 * @param {Object} derivedPropsTypes The propTypes of the derived component
 */
export const basePropTypesReducer = (basePropTypes, derivedPropNames) => (acc, propName) => {
  // If the base component propTypes include the derived propType, we use it
  if (derivedPropNames.includes(propName)) {
    return {
      ...acc,
      [propName]: basePropTypes[propName],
    };
  }

  // We ignore the base component propType otherwise
  return acc;
};
