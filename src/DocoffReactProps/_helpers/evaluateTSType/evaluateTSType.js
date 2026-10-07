import { evaluateType } from './_helpers/evaluateType';
import { defaultConfig } from './defaultConfig';

/**
 * Evaluates types, e.g. `Partial<Record<'top' | 'bottom', number>>`, into the types they result in, so that their
 * content can be presented. Types that cannot be evaluated are left as they are, with the types they consist of
 * evaluated.
 *
 * @param {Object} tsType The type as described by `react-docgen`
 * @param {Object} config The configuration that overloads `defaultConfig`
 * @returns {Object} The evaluated type
 */
export const evaluateTSType = (tsType, config = {}) => evaluateType(
  tsType,
  {
    ...defaultConfig,
    ...config,
    evaluateTypes: {
      ...defaultConfig.evaluateTypes,
      ...config.evaluateTypes,
    },
  },
);
