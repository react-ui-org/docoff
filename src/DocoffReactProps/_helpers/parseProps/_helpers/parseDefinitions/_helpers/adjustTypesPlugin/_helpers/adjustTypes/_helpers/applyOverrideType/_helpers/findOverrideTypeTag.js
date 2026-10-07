const OVERRIDE_TYPE_TAG = '@docoffOverrideType';
const OVERRIDE_TYPE_TAG_REGEX = new RegExp(`${OVERRIDE_TYPE_TAG}[ \\t]+(.+)`);

// The value of a comment does not include the two characters the comment starts with
const COMMENT_START_LENGTH = 2;

/**
 * @param {Object} node The syntax tree node whose comment can contain the override tag
 * @returns {{ comment: Object, start: number, tag: string, type: string }|null} The comment with the tag, the tag
 *   itself, the type written in it and the position of the type in the source code. `null` when there is no tag.
 */
export const findOverrideTypeTag = (node) => {
  const comment = (node.leadingComments ?? []).find(({ value }) => OVERRIDE_TYPE_TAG_REGEX.test(value));
  if (!comment) {
    return null;
  }

  const match = OVERRIDE_TYPE_TAG_REGEX.exec(comment.value);

  return {
    comment,
    start: comment.start + COMMENT_START_LENGTH + match.index + match[0].indexOf(match[1]),
    tag: match[0],
    type: match[1].trim(),
  };
};
