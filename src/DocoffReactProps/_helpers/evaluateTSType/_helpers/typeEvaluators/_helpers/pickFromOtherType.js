import { getTSTypeText } from '../../../../getTSTypeText';
import { getLiteralKeys } from '../../getLiteralKeys';

/**
 * Type that could not be resolved is presented with the picked keys, e.g. `Pick<ButtonHTMLAttributes, 'onClick'>`.
 * It is left out when it omits all the picked keys itself, e.g. `Omit<ButtonHTMLAttributes, 'color' | 'type'>`
 * when `color` is picked.
 *
 * @param {Object} otherType The type that could not be resolved
 * @param {Object} keysType The type of the picked keys, e.g. `'color'`
 * @param {string[]} keys The picked keys
 * @returns {Object|null} The type with the picked keys, `null` when it has none of them
 */
export const pickFromOtherType = (otherType, keysType, keys) => {
  const omittedKeys = otherType.name === 'Omit' && otherType.elements?.length === 2
    ? getLiteralKeys(otherType.elements[1])
    : null;

  if (omittedKeys && keys.every((key) => omittedKeys.includes(key))) {
    return null;
  }

  return {
    elements: [otherType, keysType],
    name: 'Pick',
    raw: `Pick<${getTSTypeText(otherType)}, ${getTSTypeText(keysType)}>`,
  };
};
