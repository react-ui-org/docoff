/**
 * @param {Object} tsType The type as described by `react-docgen`
 * @returns {Object[]} The members of the union including the members of unions nested in it. The type itself when
 *   it is not a union.
 */
export const getUnionMembers = (tsType) => (
  tsType.name === 'union' ? tsType.elements.flatMap(getUnionMembers) : [tsType]
);
