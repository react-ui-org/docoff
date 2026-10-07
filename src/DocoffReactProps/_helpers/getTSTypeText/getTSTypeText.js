import { isFunctionType } from '../isFunctionType';
import { isObjectType } from '../isObjectType';
import { getFunctionText } from './_helpers/getFunctionText';
import { isCompoundType } from './_helpers/isCompoundType';

/**
 * Presents the type as a text in the way it would be written in TypeScript.
 *
 * @param {Object} tsType The type as described by `react-docgen`
 * @returns {string} The type, e.g. `'asc' | 'desc'`
 */
export const getTSTypeText = (tsType) => {
  if (tsType.name === 'literal') {
    return tsType.value;
  }

  if (tsType.name === 'union') {
    return tsType.elements
      .map((element) => (isFunctionType(element) ? `(${getTSTypeText(element)})` : getTSTypeText(element)))
      .join(' | ');
  }

  if (tsType.name === 'intersection') {
    return tsType.elements
      .map((element) => (
        isFunctionType(element) || element.name === 'union' ? `(${getTSTypeText(element)})` : getTSTypeText(element)
      ))
      .join(' & ');
  }

  if (tsType.name === 'Array' && tsType.elements?.length === 1) {
    const [itemType] = tsType.elements;

    return isCompoundType(itemType) ? `(${getTSTypeText(itemType)})[]` : `${getTSTypeText(itemType)}[]`;
  }

  // Named, optional and rest members of tuple are described as `unknown`, so such tuple is presented as it is written
  if (tsType.name === 'tuple') {
    return tsType.elements.some((element) => element.name === 'unknown')
      ? tsType.raw
      : `[${tsType.elements.map(getTSTypeText).join(', ')}]`;
  }

  if (isFunctionType(tsType)) {
    return getFunctionText(tsType, getTSTypeText);
  }

  if (isObjectType(tsType)) {
    // Index signature cannot be optional
    const properties = tsType.signature.properties.map(
      (property) => `${property.key}${property.keyType || property.value.required ? '' : '?'}: ${getTSTypeText(property.value)}`,
    );

    return properties.length > 0 ? `{ ${properties.join('; ')} }` : '{}';
  }

  // Generic type, e.g. `Promise<Direction>`
  if (tsType.elements && tsType.raw?.startsWith(`${tsType.name}<`)) {
    return `${tsType.name}<${tsType.elements.map(getTSTypeText).join(', ')}>`;
  }

  return tsType.raw ?? tsType.name;
};
