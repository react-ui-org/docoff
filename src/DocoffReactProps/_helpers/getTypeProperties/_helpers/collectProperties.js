import { isObjectType } from '../../isObjectType';

/**
 * @param {Object} tsType The evaluated type
 * @returns {Object[]} The properties of the object, or of the objects that are a part of the intersection. The
 *   other parts of the intersection are types that could not be resolved, e.g. HTML attributes defined by React.
 */
export const collectProperties = (tsType) => {
  if (isObjectType(tsType)) {
    return tsType.signature.properties;
  }

  return tsType.name === 'intersection' ? tsType.elements.flatMap(collectProperties) : [];
};
