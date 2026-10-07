import { transformLiterals } from './_helpers/transformLiterals';

/**
 * Evaluators of types that change the letter case of string literals, e.g. `Uppercase<'sm' | 'md'>`.
 */
export const literalEvaluators = {
  Capitalize: ([tsType], raw) => transformLiterals(
    tsType,
    raw,
    (text) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`,
  ),
  Lowercase: ([tsType], raw) => transformLiterals(tsType, raw, (text) => text.toLowerCase()),
  Uncapitalize: ([tsType], raw) => transformLiterals(
    tsType,
    raw,
    (text) => `${text.charAt(0).toLowerCase()}${text.slice(1)}`,
  ),
  Uppercase: ([tsType], raw) => transformLiterals(tsType, raw, (text) => text.toUpperCase()),
};
