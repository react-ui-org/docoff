import { applyOverrideType } from './_helpers/applyOverrideType';
import { convertInterfaceToTypeAlias } from './_helpers/convertInterfaceToTypeAlias';
import { convertMethodToProperty } from './_helpers/convertMethodToProperty';
import { createTypeReferenceNode } from './_helpers/createTypeReferenceNode';
import { isTypeOperator } from './_helpers/isTypeOperator';
import { wrapGenericTypeAlias } from './_helpers/wrapGenericTypeAlias';

/**
 * Adjusts the types in the syntax tree so that `react-docgen` can process them.
 *
 * @param {Object|Object[]} node The syntax tree node, or a list of nodes
 * @param {Function} parseOverrideType The parser of the type written in the override tag
 * @param {string} code The source code
 * @param {Map} declaredValueTypes The types of the values declared without initial value by the names of the values
 * @returns {Object|Object[]} The adjusted node, or the list of adjusted nodes
 */
export const adjustTypes = (node, parseOverrideType, code, declaredValueTypes = new Map()) => {
  if (Array.isArray(node)) {
    return node.map((item) => adjustTypes(item, parseOverrideType, code, declaredValueTypes));
  }

  if (typeof node?.type !== 'string') {
    return node;
  }

  // Parenthesized type, e.g. `(string | number)[]`, and read-only type, e.g. `readonly string[]`, are reported
  // as `unknown`. The parentheses and the operator are removed, which keeps the meaning of the type.
  if (node.type === 'TSParenthesizedType' || isTypeOperator(node, 'readonly')) {
    return adjustTypes(node.typeAnnotation, parseOverrideType, code, declaredValueTypes);
  }

  // `typeof` of a value declared without initial value, e.g. `declare const sizes: { small: number }` in type
  // declarations, is the type of the value, as `react-docgen` reads the type of a value from its initial value only
  if (node.type === 'TSTypeQuery' && declaredValueTypes.has(node.exprName.name)) {
    return adjustTypes(
      structuredClone(declaredValueTypes.get(node.exprName.name)),
      parseOverrideType,
      code,
      declaredValueTypes,
    );
  }

  // `keyof` of a value, e.g. `keyof typeof sizes`, and of an object written in place is resolved by `react-docgen`
  if (isTypeOperator(node, 'keyof')) {
    const typeNode = adjustTypes(node.typeAnnotation, parseOverrideType, code, declaredValueTypes);

    return ['TSTypeLiteral', 'TSTypeQuery'].includes(typeNode.type)
      ? {
        ...node,
        typeAnnotation: typeNode,
      }
      : createTypeReferenceNode(node, 'keyof', [typeNode]);
  }

  // Indexed access type, e.g. `Props['size']`, is resolved by `react-docgen` only when the indexed type is an object
  // written in place
  if (node.type === 'TSIndexedAccessType') {
    return createTypeReferenceNode(node, 'indexedAccess', [
      adjustTypes(node.objectType, parseOverrideType, code, declaredValueTypes),
      adjustTypes(node.indexType, parseOverrideType, code, declaredValueTypes),
    ]);
  }

  if (node.type === 'TSInterfaceDeclaration') {
    convertInterfaceToTypeAlias(node);
  }

  if (node.type === 'TSMethodSignature' && node.kind === 'method') {
    convertMethodToProperty(node, code);
  }

  applyOverrideType(node, parseOverrideType);

  Object.keys(node).forEach((key) => {
    // eslint-disable-next-line no-param-reassign
    node[key] = adjustTypes(node[key], parseOverrideType, code, declaredValueTypes);
  });

  if (node.type === 'TSTypeAliasDeclaration') {
    wrapGenericTypeAlias(node);
  }

  return node;
};
