import { isObjectType } from '../../../../isObjectType';
import { mergeProperties } from '../../../../mergeProperties';
import { getIntersectionMembers } from '../../getIntersectionMembers';
import { getLiteralKeys } from '../../getLiteralKeys';
import { getUnionMembers } from '../../getUnionMembers';
import { createUnionType } from './createUnionType';

/**
 * @param {Object} property The property of an object type
 * @returns {Object[]} The type of the property. The members of its union and `undefined` when it is optional,
 *   the same way as in TypeScript.
 */
const getValueTypes = (property) => {
  const {
    required,
    ...valueType
  } = property.value;
  const members = getUnionMembers(valueType);

  if (required) {
    return [valueType];
  }

  return members.some((member) => member.name === 'undefined') ? members : [...members, { name: 'undefined' }];
};

/**
 * Reads the types of the properties of the given keys, e.g. `Props['size']`. The parts of the intersection that could
 * not be resolved, e.g. types of a package, are not known, so the properties are looked up in its objects only.
 *
 * @param {Object} tsType The object type, or the intersection with object types
 * @param {Object} keysType The type of the keys, e.g. `'size'`
 * @param {string} raw The resulting type as it is written
 * @returns {Object|null} The type of the property, or the union of the types of the properties, `null` when any
 *   of the properties is not found
 */
export const getPropertyTypes = (tsType, keysType, raw) => {
  const keys = getLiteralKeys(keysType);
  if (!keys) {
    return null;
  }

  const properties = mergeProperties(
    getIntersectionMembers(tsType)
      .filter(isObjectType)
      .flatMap((objectType) => objectType.signature.properties),
  );
  const keyProperties = keys.map((key) => properties.find((property) => property.key === key));

  return keyProperties.includes(undefined) ? null : createUnionType(keyProperties.flatMap(getValueTypes), raw);
};
