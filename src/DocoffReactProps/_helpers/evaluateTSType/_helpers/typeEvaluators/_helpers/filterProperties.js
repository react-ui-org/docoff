import { createObjectType } from '../../createObjectType';
import { getLiteralKeys } from '../../getLiteralKeys';
import { mapObjectTypes } from './mapObjectTypes';

/**
 * @param {Object} tsType The object type, or the intersection with object types
 * @param {Object} keysType The type of the listed keys, e.g. `'top' | 'bottom'`
 * @param {string} raw The resulting type as it is written
 * @param {Function} isKept Tells whether a property is kept based on whether its key is listed
 * @param {Function} filterOtherType Filters a type of the intersection that could not be resolved by the listed keys,
 *   see `mapObjectTypes`
 * @returns {Object|null} The type with the kept properties, `null` when the type cannot be evaluated
 */
export const filterProperties = (tsType, keysType, raw, isKept, filterOtherType = (otherType) => otherType) => {
  const keys = getLiteralKeys(keysType);

  return keys
    ? mapObjectTypes(
      tsType,
      raw,
      (objectType) => createObjectType(
        objectType.signature.properties.filter((property) => isKept(keys.includes(property.key))),
        raw,
      ),
      (otherType) => filterOtherType(otherType, keys),
    )
    : null;
};
