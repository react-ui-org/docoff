import { isObjectType } from '../../../../isObjectType';
import { getIntersectionMembers } from '../../getIntersectionMembers';

/**
 * Applies the change to the object, or to the objects that are a part of the intersection, including the
 * intersections nested in it. The other parts of the intersection are types that could not be resolved, e.g. types
 * of a package, so they are left as they are unless `mapOtherType` changes them.
 *
 * @param {Object} tsType The object type, or the intersection type
 * @param {string} raw The resulting type as it is written
 * @param {Function} mapObjectType Changes an object type
 * @param {Function} mapOtherType Changes a type that could not be resolved, `null` leaves it out of the intersection
 * @returns {Object|null} The changed type, `null` when the type contains no object
 */
export const mapObjectTypes = (tsType, raw, mapObjectType, mapOtherType = (otherType) => otherType) => {
  if (isObjectType(tsType)) {
    return mapObjectType(tsType);
  }

  const members = getIntersectionMembers(tsType);
  if (tsType.name !== 'intersection' || !members.some(isObjectType)) {
    return null;
  }

  const elements = members
    .map((member) => (isObjectType(member) ? mapObjectType(member) : mapOtherType(member)))
    .filter((element) => element !== null);

  return elements.length === 1
    ? elements[0]
    : {
      ...tsType,
      elements,
      raw,
    };
};
