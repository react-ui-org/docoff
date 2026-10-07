const OPENING_BRACKETS = ['(', '[', '{', '<'];
const CLOSING_BRACKETS = [')', ']', '}', '>'];
const QUOTES = ['\'', '"', '`'];

/**
 * @param {string} text The type as it is written
 * @returns {(number|null)[]} Nesting depth of brackets after each character of the text, `null` for characters
 *   enclosed in quotes
 */
export const getBracketDepths = (text) => {
  let depth = 0;
  let quote = null;

  return text.split('').map((char, index) => {
    if (quote) {
      quote = char === quote ? null : quote;

      return null;
    }

    if (QUOTES.includes(char)) {
      quote = char;

      return null;
    }

    if (OPENING_BRACKETS.includes(char)) {
      depth += 1;
    } else if (CLOSING_BRACKETS.includes(char) && !(char === '>' && text[index - 1] === '=')) {
      // The `>` of the arrow of a function type is not a bracket
      depth -= 1;
    }

    return depth;
  });
};
