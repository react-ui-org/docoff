import { getLiteralKeys } from '../../getLiteralKeys';

/**
 * Properties of mapped types and index signatures are described by the type of their key instead of their name.
 *
 * @param {Object} property The property of an object type
 * @returns {Object[]} The properties with names as their keys
 */
export const getNamedProperties = (property) => {
  if (typeof property.key === 'string') {
    return [property];
  }

  const keys = getLiteralKeys(property.key);

  // Mapped type, e.g. `{ [Key in 'top' | 'bottom']?: number }`
  if (keys) {
    return keys.map((key) => ({
      key,
      value: {
        ...property.value,
        required: property.key.required ?? true,
      },
    }));
  }

  // Index signature, e.g. `{ [key: string]: number }`. The type of its keys tells it apart from properties.
  return [{
    key: `[key: ${property.key.raw ?? property.key.name}]`,
    keyType: property.key,
    value: {
      ...property.value,
      required: false,
    },
  }];
};
