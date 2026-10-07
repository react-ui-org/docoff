import { getUnionMembers } from '../../getUnionMembers';

/**
 * Union consisting only of unions of literals, e.g. a union of type aliases, is a single union of all the literals.
 * Unions that also contain other types are left as they are, so that the literals stay grouped.
 *
 * @param {Object} tsType The union type
 * @returns {Object} The union with members of the nested unions, or the type itself
 */
export const mergeLiteralUnion = (tsType) => {
  const members = getUnionMembers(tsType);

  return members.every((member) => member.name === 'literal')
    ? {
      ...tsType,
      elements: members,
    }
    : tsType;
};
