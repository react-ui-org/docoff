import { isObjectType } from '../../../../isObjectType';
import { mergeProperties } from '../../../../mergeProperties';
import { createObjectType } from '../../createObjectType';

/**
 * Intersection of objects is an object with properties of them all. Property defined by more of the objects is
 * of the intersection of the types of its definitions, which is merged as well when the types are objects.
 *
 * @param {Object} tsType The intersection type
 * @returns {Object} The object, or the type itself when it does not consist of objects only
 */
export const mergeObjectIntersection = (tsType) => (
  tsType.elements.every(isObjectType)
    ? createObjectType(
      mergeProperties(tsType.elements.flatMap((element) => element.signature.properties)).map((property) => (
        property.value.name === 'intersection'
          ? {
            ...property,
            value: {
              ...mergeObjectIntersection(property.value),
              required: property.value.required,
            },
          }
          : property
      )),
      tsType.raw,
    )
    : tsType
);
