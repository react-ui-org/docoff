import { decodeStringLiteral } from './decodeStringLiteral';
import { getUnionMembers } from './getUnionMembers';

const STRING_LITERAL_REGEX = /^['"]/;

/**
 * @param {Object} tsType The type of keys, e.g. `'top' | 'bottom'`
 * @returns {string[]|null} The keys, e.g. `['top', 'bottom']`, or `null` when the type is not made of literals only
 */
export const getLiteralKeys = (tsType) => {
  const members = getUnionMembers(tsType);

  return members.every((member) => member.name === 'literal')
    ? members.map((member) => (
      STRING_LITERAL_REGEX.test(member.value) ? decodeStringLiteral(member.value) : member.value
    ))
    : null;
};
