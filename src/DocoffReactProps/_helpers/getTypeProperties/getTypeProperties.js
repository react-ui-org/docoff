import { mergeProperties } from '../mergeProperties';
import { collectProperties } from './_helpers/collectProperties';

/**
 * @param {Object[]} tsTypes The evaluated types that define props
 * @returns {Object[]} The props sorted by their names, each with its `key`, `value` and `description`
 */
export const getTypeProperties = (tsTypes) => mergeProperties(tsTypes.flatMap(collectProperties))
  .sort((propertyA, propertyB) => (propertyA.key < propertyB.key ? -1 : 1));
