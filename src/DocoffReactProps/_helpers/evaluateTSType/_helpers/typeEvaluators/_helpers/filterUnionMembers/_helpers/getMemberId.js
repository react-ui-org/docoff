/**
 * @param {Object} tsType The member of a union
 * @returns {string} The identifier the members are compared by
 */
export const getMemberId = (tsType) => (tsType.name === 'literal' ? tsType.value : tsType.name);
