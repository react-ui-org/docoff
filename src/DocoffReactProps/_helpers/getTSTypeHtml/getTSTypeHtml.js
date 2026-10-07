import { escapeHtml } from '../escapeHtml';
import { getTSTypeText } from '../getTSTypeText';
import { isFunctionType } from '../isFunctionType';
import { isObjectType } from '../isObjectType';
import { getCodeHtml } from './_helpers/getCodeHtml';
import { getListHtml } from './_helpers/getListHtml';

/**
 * Presents the type as HTML: arrays, objects and unions as lists of what they consist of, other types as code.
 *
 * @param {Object} tsType The type as described by `react-docgen`
 * @returns {string} The HTML code
 */
export const getTSTypeHtml = (tsType) => {
  if (tsType.name === 'Array') {
    return getListHtml('Array', tsType.elements.map(getTSTypeHtml));
  }

  if (isObjectType(tsType)) {
    return getListHtml(
      'Object',
      tsType.signature.properties.map(
        (property) => `${escapeHtml(property.key)}${property.value.required ? '*' : ''}: ${getTSTypeHtml(property.value)}`,
      ),
    );
  }

  if (tsType.name === 'union') {
    return getListHtml('Union', tsType.elements.map(getTSTypeHtml));
  }

  // Function is presented as it is written, or as it is expanded when `expandFunctionSignatures` is turned on
  return getCodeHtml(isFunctionType(tsType) ? tsType.raw : getTSTypeText(tsType));
};
