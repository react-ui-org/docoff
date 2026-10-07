import { unwrapPromise } from './_helpers/unwrapPromise';

/**
 * Evaluators of types that only wrap another type, e.g. `Readonly<Props>`.
 */
export const wrapperEvaluators = {
  Awaited: ([tsType]) => unwrapPromise(tsType),
  NoInfer: ([tsType]) => tsType,
  Readonly: ([tsType]) => tsType,
  ReadonlyArray: (elements, raw) => ({
    elements,
    name: 'Array',
    raw,
  }),
};
