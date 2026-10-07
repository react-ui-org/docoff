import { createStringLiteral } from '../../createStringLiteral';

/**
 * @param {Object} property The property of an object type
 * @returns {Object[]} The types of the keys of the property: its name as a literal, or the type of the keys of index
 *   signature. Index signature with `string` keys accepts `number` keys as well, the same way as in TypeScript.
 */
export const getPropertyKeyTypes = (property) => {
  if (!property.keyType) {
    return [createStringLiteral(property.key)];
  }

  return property.keyType.name === 'string' ? [property.keyType, { name: 'number' }] : [property.keyType];
};
