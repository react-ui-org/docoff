const TYPE_ALIAS_PREFIX = 'type DocoffOverrideType = ';

/**
 * @param {Function} parse The Babel parser
 * @param {Object} parserOpts The options of the Babel parser
 * @returns {Function} The parser of the type written in the override tag. It gets the type and the position where
 *   it is written in the source code, and it returns the syntax tree node of the type.
 */
export const createOverrideTypeParser = (parse, parserOpts) => (text, start) => {
  try {
    // The type is parsed at the position where it is written, so that it can be printed from the source code
    const padding = ' '.repeat(Math.max(start - TYPE_ALIAS_PREFIX.length, 0));

    return parse(`${padding}${TYPE_ALIAS_PREFIX}${text}`, parserOpts).program.body[0].typeAnnotation;
  } catch {
    // What is not a valid type is presented as it is written
    return {
      end: start + text.length,
      start,
      type: 'TSTypeReference',
      typeName: {
        name: text,
        type: 'Identifier',
      },
    };
  }
};
