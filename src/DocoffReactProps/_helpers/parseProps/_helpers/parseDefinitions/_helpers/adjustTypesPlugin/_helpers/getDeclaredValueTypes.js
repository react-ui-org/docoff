/**
 * Values in type declarations have no initial value to read their type from, only their type, e.g.
 * `declare const sizes: { small: number }`.
 *
 * @param {Object} file The parsed file
 * @returns {Map} The types of the values declared without initial value by the names of the values
 */
export const getDeclaredValueTypes = (file) => new Map(file.program.body
  .map((statement) => (statement.type === 'ExportNamedDeclaration' ? statement.declaration : statement))
  .filter((statement) => statement?.type === 'VariableDeclaration')
  .flatMap((statement) => statement.declarations)
  .filter((declarator) => declarator.init === null && declarator.id.type === 'Identifier' && declarator.id.typeAnnotation)
  .map((declarator) => [declarator.id.name, structuredClone(declarator.id.typeAnnotation.typeAnnotation)]));
