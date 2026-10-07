import { isObjectType } from '../../../../isObjectType';
import { createObjectType } from '../../createObjectType';
import { getIntersectionMembers } from '../../getIntersectionMembers';

/**
 * Adds optional `children` of type `ReactNode` to the props, the same way as `PropsWithChildren` does. Children that
 * are already defined are kept, they are only narrowed by the intersection with `ReactNode`.
 *
 * @param {Object} tsType The object type, or the intersection with object types, e.g. with HTML attributes that could
 *   not be resolved
 * @param {string} raw The resulting type as it is written
 * @returns {Object|null} The type with children, `null` when the type contains no object
 */
export const addChildrenProperty = (tsType, raw) => {
  const members = getIntersectionMembers(tsType);
  const objectTypes = members.filter(isObjectType);
  if (objectTypes.length === 0) {
    return null;
  }

  const hasChildren = objectTypes.some(
    (objectType) => objectType.signature.properties.some((property) => property.key === 'children'),
  );
  const childrenProperties = hasChildren ? [] : [{
    key: 'children',
    value: {
      name: 'ReactNode',
      required: false,
    },
  }];

  if (isObjectType(tsType)) {
    return createObjectType([...tsType.signature.properties, ...childrenProperties], raw);
  }

  return {
    ...tsType,
    elements: hasChildren ? members : [...members, createObjectType(childrenProperties, raw)],
    raw,
  };
};
