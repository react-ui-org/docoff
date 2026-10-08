import { adjustTypes } from './_helpers/adjustTypes';
import { createOverrideTypeParser } from './_helpers/createOverrideTypeParser';
import { getDeclaredValueTypes } from './_helpers/getDeclaredValueTypes';

/**
 * Babel plugin that adjusts the types in the parsed source code. `react-docgen` does not recognize some of the type
 * syntax and reports it as `unknown` or incorrectly, so the syntax tree is adjusted before it gets processed.
 */
export const adjustTypesPlugin = {
  parserOverride: (code, parserOpts, parse) => {
    const file = parse(code, parserOpts);

    return adjustTypes(file, createOverrideTypeParser(parse, parserOpts), code, getDeclaredValueTypes(file));
  },
};
