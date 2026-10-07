import { getUnionMembers } from '../../../getUnionMembers';
import { createUnionType } from '../createUnionType';
import { isNullishType } from '../isNullishType';
import { getMemberId } from './_helpers/getMemberId';

const PRIMITIVE_TYPE_NAMES = ['bigint', 'number', 'string', 'symbol'];

/**
 * @param {Object} tsType The union type
 * @param {Object} listedType The type of the listed members, e.g. `'flat' | null`
 * @param {string} raw The resulting type as it is written
 * @param {Function} isKept Tells whether a member is kept based on whether it is listed
 * @returns {Object|null} The union of the kept members, `null` when the type cannot be evaluated
 */
export const filterUnionMembers = (tsType, listedType, raw, isKept) => {
  const members = getUnionMembers(tsType);
  const listedMembers = getUnionMembers(listedType);

  // Only literals and nullish types can be compared by their name. Primitive types, e.g. `string`, are never one
  // of the listed members, but other types, e.g. `boolean` or a type that could not be resolved, can contain them.
  const isComparable = (member) => member.name === 'literal' || isNullishType(member);
  if (
    !listedMembers.every(isComparable)
    || !members.every((member) => isComparable(member) || PRIMITIVE_TYPE_NAMES.includes(member.name))
  ) {
    return null;
  }

  const listedIds = listedMembers.map(getMemberId);

  return createUnionType(members.filter((member) => isKept(listedIds.includes(getMemberId(member)))), raw);
};
