import { getUnionMembers } from '../../../getUnionMembers';
import { createUnionType } from '../createUnionType';
import { isStringLiteral } from './_helpers/isStringLiteral';

/**
 * @param {Object} tsType The string literal, or the union of string literals
 * @param {string} raw The resulting type as it is written
 * @param {Function} transform Transforms the text of a literal
 * @returns {Object|null} The transformed literals, `null` when the type does not consist of string literals only
 */
export const transformLiterals = (tsType, raw, transform) => {
  const members = getUnionMembers(tsType);

  return members.every(isStringLiteral)
    ? createUnionType(
      members.map((member) => ({
        ...member,
        value: `${member.value[0]}${transform(member.value.slice(1, -1))}${member.value[0]}`,
      })),
      raw,
    )
    : null;
};
