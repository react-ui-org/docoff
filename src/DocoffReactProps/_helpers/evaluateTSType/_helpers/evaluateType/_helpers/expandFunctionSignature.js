import { getTSTypeText } from '../../../../getTSTypeText';

/**
 * Function is presented with evaluated types of its parameters and of its return value, e.g.
 * `(direction: 'asc' | 'desc') => void` instead of `(direction: Direction) => void`.
 *
 * @param {Object} tsType The function type
 * @param {Function} evaluateType Evaluates a type of a parameter or of the return value
 * @returns {Object} The function type that is written using the evaluated types
 */
export const expandFunctionSignature = (tsType, evaluateType) => {
  const parameters = tsType.signature.arguments;
  const returnType = tsType.signature.return;
  const expandedType = {
    ...tsType,
    signature: {
      ...tsType.signature,
      arguments: parameters.map((parameter) => ({
        ...parameter,
        ...(parameter.type && { type: evaluateType(parameter.type) }),
      })),
      ...(returnType && { return: evaluateType(returnType) }),
    },
  };

  return {
    ...expandedType,
    raw: getTSTypeText(expandedType),
  };
};
