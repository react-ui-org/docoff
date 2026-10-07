import { UNIQUE_TYPE_NAME_SEPARATOR } from '../constants';

/**
 * @param {string} name The name of a type, possibly made unique by the importer
 * @returns {string} The name of the type as it is written in the source code
 */
export const getOriginalTypeName = (name) => name.split(UNIQUE_TYPE_NAME_SEPARATOR)[0];
