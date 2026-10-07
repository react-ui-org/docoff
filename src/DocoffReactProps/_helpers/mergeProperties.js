import { getTSTypeText } from './getTSTypeText';

/**
 * Property defined more times is of the intersection of the types of its definitions, the same types are presented
 * once. It is required when any of its definitions is required. Otherwise, its last definition is used.
 *
 * @param {Object[]} properties The properties of object types, possibly with more definitions of a property
 * @returns {Object[]} The properties, each defined once
 */
export const mergeProperties = (properties) => {
  const definitionsByKey = new Map();
  properties.forEach((property) => {
    definitionsByKey.set(property.key, [...(definitionsByKey.get(property.key) ?? []), property]);
  });

  return [...definitionsByKey.values()].map((definitions) => {
    if (definitions.length === 1) {
      return definitions[0];
    }

    const types = [
      ...new Map(definitions.map((definition) => [getTSTypeText(definition.value), definition.value])).values(),
    ];
    const intersectionType = {
      elements: types,
      name: 'intersection',
    };

    return {
      ...definitions.at(-1),
      value: {
        ...(types.length === 1 ? types[0] : {
          ...intersectionType,
          raw: getTSTypeText(intersectionType),
        }),
        required: definitions.some((definition) => definition.value.required),
      },
    };
  });
};
