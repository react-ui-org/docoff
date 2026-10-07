import { findOverrideTypeTag } from './_helpers/findOverrideTypeTag';
import { getTypeHolderNode } from './_helpers/getTypeHolderNode';

/**
 * The type to present can be defined by the override tag in the comment of a type alias or of a property. The
 * actual type is replaced by the type written in the tag.
 *
 * @param {Object} node The syntax tree node
 * @param {Function} parseOverrideType The parser of the type written in the override tag
 */
export const applyOverrideType = (node, parseOverrideType) => {
  const typeHolderNode = getTypeHolderNode(node);
  const overrideTypeTag = typeHolderNode && findOverrideTypeTag(node);
  if (!overrideTypeTag) {
    return;
  }

  typeHolderNode.typeAnnotation = parseOverrideType(overrideTypeTag.type, overrideTypeTag.start);

  // The tag is removed from the comment as it is not a part of the description
  overrideTypeTag.comment.value = overrideTypeTag.comment.value.replace(overrideTypeTag.tag, '');
};
