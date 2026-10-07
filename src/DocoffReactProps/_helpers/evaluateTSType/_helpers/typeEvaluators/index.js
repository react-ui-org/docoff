import { literalEvaluators } from './literalEvaluators';
import { objectEvaluators } from './objectEvaluators';
import { unionEvaluators } from './unionEvaluators';
import { wrapperEvaluators } from './wrapperEvaluators';

/**
 * Types that can be evaluated from what `react-docgen` knows about their type arguments. The key is the name of the
 * type. The evaluator gets the type arguments and the type as it is written, and it returns the resulting type,
 * or `null` when the type cannot be evaluated.
 */
export const typeEvaluators = {
  ...literalEvaluators,
  ...objectEvaluators,
  ...unionEvaluators,
  ...wrapperEvaluators,
};
