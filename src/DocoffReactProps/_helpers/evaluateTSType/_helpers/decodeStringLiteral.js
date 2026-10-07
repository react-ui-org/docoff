const ESCAPE_SEQUENCE_REGEX = /\\(?:u\{([\dA-Fa-f]+)\}|u([\dA-Fa-f]{4})|x([\dA-Fa-f]{2})|([\s\S]))/g;

const ESCAPED_CHARACTERS = {
  0: '\0',
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t',
  v: '\v',
};

/**
 * @param {string} value The string literal as it is written, e.g. `'top'` or `"say \"hi\""`
 * @returns {string} The string, e.g. `top` or `say "hi"`
 */
export const decodeStringLiteral = (value) => value
  .slice(1, -1)
  .replace(ESCAPE_SEQUENCE_REGEX, (sequence, codePoint, unicode, hex, character) => {
    const code = codePoint ?? unicode ?? hex;

    return code ? String.fromCodePoint(parseInt(code, 16)) : ESCAPED_CHARACTERS[character] ?? character;
  });
