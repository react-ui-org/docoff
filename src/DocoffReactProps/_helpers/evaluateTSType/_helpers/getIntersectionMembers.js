/**
 * @param {Object} tsType The type as described by `react-docgen`
 * @returns {Object[]} The members of the intersection including the members of intersections nested in it. The type
 *   itself when it is not an intersection.
 */
export const getIntersectionMembers = (tsType) => (
  tsType.name === 'intersection' ? tsType.elements.flatMap(getIntersectionMembers) : [tsType]
);
