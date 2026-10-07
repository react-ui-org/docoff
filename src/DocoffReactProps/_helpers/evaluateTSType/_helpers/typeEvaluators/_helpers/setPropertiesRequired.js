import { createObjectType } from '../../createObjectType';
import { mapObjectTypes } from './mapObjectTypes';

/**
 * @param {Object} tsType The object type, or the intersection with object types
 * @param {string} raw The resulting type as it is written
 * @param {boolean} required Whether the properties are required
 * @returns {Object|null} The type with all properties either required or optional, `null` when the type cannot
 *   be evaluated. Index signatures are kept as they are, as they cannot be required.
 */
export const setPropertiesRequired = (tsType, raw, required) => mapObjectTypes(
  tsType,
  raw,
  (objectType) => createObjectType(
    objectType.signature.properties.map((property) => (
      property.keyType
        ? property
        : {
          ...property,
          value: {
            ...property.value,
            required,
          },
        }
    )),
    raw,
  ),
);
