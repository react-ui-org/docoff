import { typeEvaluators } from '../../typeEvaluators';

/**
 * @param {Object} tsType The type as described by `react-docgen`
 * @param {Object} evaluateTypes Types to evaluate by their name, see `defaultConfig`
 * @returns {Function|null} The function that evaluates the type, `null` when the type is not to be evaluated
 */
export const getTypeEvaluator = (tsType, evaluateTypes) => {
  const rule = Object.hasOwn(evaluateTypes, tsType.name) ? evaluateTypes[tsType.name] : false;

  if (typeof rule === 'function') {
    return rule;
  }

  return rule && Object.hasOwn(typeEvaluators, tsType.name) && tsType.elements
    ? (evaluatedType) => typeEvaluators[tsType.name](evaluatedType.elements, evaluatedType.raw)
    : null;
};
