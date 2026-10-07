import { adjustTypes } from './_helpers/adjustTypes';
import { createOverrideTypeParser } from './_helpers/createOverrideTypeParser';

/**
 * Babel plugin that adjusts the types in the parsed source code. `react-docgen` does not recognize some of the type
 * syntax and reports it as `unknown` or incorrectly, so the syntax tree is adjusted before it gets processed.
 */
export const adjustTypesPlugin = {
  parserOverride: (code, parserOpts, parse) => adjustTypes(
    parse(code, parserOpts),
    createOverrideTypeParser(parse, parserOpts),
    code,
  ),
};
