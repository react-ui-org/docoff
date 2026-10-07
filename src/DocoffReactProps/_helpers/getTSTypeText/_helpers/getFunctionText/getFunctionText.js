import { getWrittenParameters } from './_helpers/getWrittenParameters';

const WRITTEN_PARAMETER_REGEX = /^(\.\.\.)?([A-Za-z_$][\w$]*)(\?)?\s*:/;

/**
 * The function type is composed of the types of its parameters, so that they are presented evaluated. It is only
 * possible when all the parameters can be matched to how they are written, which keeps their optional (`?`) and
 * rest (`...`) marks. Otherwise, e.g. for generic functions, the function type is presented as it is written.
 *
 * @param {Object} tsType The function type as described by `react-docgen`
 * @param {Function} getTypeText Presents a type of a parameter or of the return value as a text
 * @returns {string} The function type, e.g. `(column: string, direction?: 'asc' | 'desc') => void`
 */
export const getFunctionText = (tsType, getTypeText) => {
  const writtenParameters = getWrittenParameters(tsType.raw);
  const parameters = tsType.signature.arguments;
  const returnType = tsType.signature.return;

  if (!writtenParameters || writtenParameters.length !== parameters.length || !returnType) {
    return tsType.raw;
  }

  const parameterTexts = parameters.map((parameter, index) => {
    const match = WRITTEN_PARAMETER_REGEX.exec(writtenParameters[index]);

    return match && match[2] === parameter.name && parameter.type
      ? `${match[1] ?? ''}${parameter.name}${match[3] ?? ''}: ${getTypeText(parameter.type)}`
      : null;
  });

  return parameterTexts.includes(null)
    ? tsType.raw
    : `(${parameterTexts.join(', ')}) => ${getTypeText(returnType)}`;
};
