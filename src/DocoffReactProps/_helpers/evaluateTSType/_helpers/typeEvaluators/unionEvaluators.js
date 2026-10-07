import { getUnionMembers } from '../getUnionMembers';
import { createUnionType } from './_helpers/createUnionType';
import { filterUnionMembers } from './_helpers/filterUnionMembers';
import { isNullishType } from './_helpers/isNullishType';

/**
 * Evaluators of types that select members of a union, e.g. `Exclude<'filled' | 'outline' | 'flat', 'flat'>`.
 */
export const unionEvaluators = {
  Exclude: ([tsType, excludedType], raw) => filterUnionMembers(tsType, excludedType, raw, (isListed) => !isListed),
  Extract: ([tsType, extractedType], raw) => filterUnionMembers(tsType, extractedType, raw, (isListed) => isListed),
  NonNullable: ([tsType], raw) => (
    tsType.name === 'union' || isNullishType(tsType)
      ? createUnionType(getUnionMembers(tsType).filter((member) => !isNullishType(member)), raw)
      : null
  ),
};
