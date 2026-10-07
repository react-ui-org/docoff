/**
 * @param {Object[]} members The members of the union
 * @param {string} raw The type as it is written
 * @returns {Object} The union type, its only member when there is just one, or `never` when there is none
 */
export const createUnionType = (members, raw) => {
  if (members.length === 0) {
    return { name: 'never' };
  }

  return members.length === 1
    ? members[0]
    : {
      elements: members,
      name: 'union',
      raw,
    };
};
