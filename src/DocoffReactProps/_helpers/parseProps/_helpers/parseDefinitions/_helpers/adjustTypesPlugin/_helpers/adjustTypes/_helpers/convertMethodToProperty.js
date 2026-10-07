/**
 * `react-docgen` presents a method, e.g. `onChange(value: string): void`, by the type it returns. Therefore, the
 * method is replaced by a property of a function type of the same meaning, e.g. `onChange: (value: string) => void`.
 * The function type is printed from the source code of the method, e.g. `(value: string): void`.
 *
 * @param {Object} node The syntax tree node of the method, it is changed in place so that it keeps its comments
 * @param {string} code The source code
 */
export const convertMethodToProperty = (node, code) => {
  // The function type starts with the type parameters, or with the parenthesis that follows the name of the method
  const start = node.typeParameters?.start ?? code.indexOf('(', node.key.end);
  const end = node.typeAnnotation?.end ?? node.end;
  const functionType = {
    end,
    loc: node.loc,
    parameters: node.parameters,
    start,
    type: 'TSFunctionType',
    typeAnnotation: node.typeAnnotation,
    typeParameters: node.typeParameters,
  };

  /* eslint-disable no-param-reassign */
  node.type = 'TSPropertySignature';
  node.typeAnnotation = {
    end,
    loc: node.loc,
    start,
    type: 'TSTypeAnnotation',
    typeAnnotation: functionType,
  };
  delete node.kind;
  delete node.parameters;
  delete node.typeParameters;
  /* eslint-enable no-param-reassign */
};
