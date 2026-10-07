import { isFunctionType } from '../../../isFunctionType';
import { isObjectType } from '../../../isObjectType';
import { expandFunctionSignature } from './_helpers/expandFunctionSignature';
import { getNamedProperties } from './_helpers/getNamedProperties';
import { getTypeEvaluator } from './_helpers/getTypeEvaluator';
import { mergeLiteralUnion } from './_helpers/mergeLiteralUnion';
import { mergeObjectIntersection } from './_helpers/mergeObjectIntersection';

/**
 * Evaluates the type from inside out: first its type arguments and properties, then the type itself.
 *
 * @param {Object} tsType The type as described by `react-docgen`
 * @param {Object} config The complete configuration, see `defaultConfig`
 * @returns {Object} The evaluated type
 */
export const evaluateType = (tsType, config) => {
  const evaluatedType = {
    ...tsType,
    ...(tsType.elements && { elements: tsType.elements.map((element) => evaluateType(element, config)) }),
    ...(isObjectType(tsType) && {
      signature: {
        ...tsType.signature,
        properties: tsType.signature.properties
          .map((property) => ({
            ...property,
            value: {
              ...evaluateType(property.value, config),
              required: property.value.required,
            },
          }))
          .flatMap(getNamedProperties),
      },
    }),
  };

  if (config.expandFunctionSignatures && isFunctionType(evaluatedType)) {
    return expandFunctionSignature(evaluatedType, (type) => evaluateType(type, config));
  }

  const typeEvaluator = getTypeEvaluator(evaluatedType, config.evaluateTypes);
  if (typeEvaluator) {
    return typeEvaluator(evaluatedType) ?? evaluatedType;
  }

  if (config.mergeLiteralUnions && evaluatedType.name === 'union') {
    return mergeLiteralUnion(evaluatedType);
  }

  if (config.mergeObjectIntersections && evaluatedType.name === 'intersection') {
    return mergeObjectIntersection(evaluatedType);
  }

  return evaluatedType;
};
