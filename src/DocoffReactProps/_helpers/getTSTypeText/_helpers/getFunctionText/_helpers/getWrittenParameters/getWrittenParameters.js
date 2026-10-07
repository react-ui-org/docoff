import { getBracketDepths } from './_helpers/getBracketDepths';

/**
 * @param {string} raw The function type as it is written, e.g. `(column: string, direction?: Direction) => void`,
 *   or as it is written in a method, e.g. `(column: string, direction?: Direction): void`
 * @returns {string[]|null} The parameters as they are written, e.g. `['column: string', 'direction?: Direction']`,
 *   or `null` when the function type does not start with the list of its parameters, e.g. when it is generic
 */
export const getWrittenParameters = (raw) => {
  if (!raw.startsWith('(')) {
    return null;
  }

  const depths = getBracketDepths(raw);
  const end = depths.indexOf(0);
  if (end === -1 || !/^\s*(=>|:)/.test(raw.slice(end + 1))) {
    return null;
  }

  return raw
    .slice(1, end)
    .split('')
    // Parameters are separated by commas that are not enclosed in other brackets or quotes
    .reduce(
      (parameters, char, index) => (
        char === ',' && depths[index + 1] === 1
          ? [...parameters, '']
          : [...parameters.slice(0, -1), `${parameters[parameters.length - 1]}${char}`]
      ),
      [''],
    )
    .map((parameter) => parameter.trim())
    .filter((parameter) => parameter !== '');
};
