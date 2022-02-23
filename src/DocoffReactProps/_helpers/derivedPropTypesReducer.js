/*
 * Determines which of the propType definitions of the derived component should overload
 * propTypes of the base component
 * @param {Object} basePropTypes The propTypes of the base component
 * @param {Object} derivedPropsTypes The propTypes of the derived component
 */
export const derivedPropTypesReducer = (basePropTypes, derivedPropTypes) => (acc, propName) => {
    // If the derived component propType has `description` we use the propType
    if (derivedPropTypes[propName].description) {
        return {
            ...acc,
            [propName]: derivedPropTypes[propName],
        };
    }

    // If the derived component propType defines default value we use the base component propTypes definition
    // with the new default value
    if (
        basePropTypes[propName]
        && derivedPropTypes[propName].defaultValue
        && !derivedPropTypes[propName].defaultValue.computed
    ) {
        return {
            ...acc,
            [propName]: {
                ...basePropTypes[propName],
                defaultValue: derivedPropTypes[propName].defaultValue,
            },
        };
    }

    // We ignore the derived component propType otherwise
    return acc;
}
