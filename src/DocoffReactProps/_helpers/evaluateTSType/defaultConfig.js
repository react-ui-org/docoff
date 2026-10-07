import { typeEvaluators } from './_helpers/typeEvaluators';

/**
 * Default configuration of how types are evaluated. It can be overloaded by `window.docoffConfig.reactProps`.
 */
export const defaultConfig = {
  // Types to evaluate by their name: `true` to evaluate the type, `false` to present it as it is written with its
  // type arguments evaluated, or a function that gets the type as described by `react-docgen` and returns the type
  // to present.
  evaluateTypes: Object.fromEntries(Object.keys(typeEvaluators).sort().map((name) => [name, true])),
  // Whether functions are presented with evaluated types of their parameters and of their return value
  expandFunctionSignatures: true,
  // Whether a union consisting only of unions of literals is presented as a single union
  mergeLiteralUnions: true,
  // Whether an intersection of objects is presented as a single object
  mergeObjectIntersections: true,
};
