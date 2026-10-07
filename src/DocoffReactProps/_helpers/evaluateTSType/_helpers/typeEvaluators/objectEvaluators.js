import { isObjectType } from '../../../isObjectType';
import { createObjectType } from '../createObjectType';
import { getLiteralKeys } from '../getLiteralKeys';
import { addChildrenProperty } from './_helpers/addChildrenProperty';
import { createUnionType } from './_helpers/createUnionType';
import { filterProperties } from './_helpers/filterProperties';
import { getPropertyKeyTypes } from './_helpers/getPropertyKeyTypes';
import { getPropertyTypes } from './_helpers/getPropertyTypes';
import { pickFromOtherType } from './_helpers/pickFromOtherType';
import { setPropertiesRequired } from './_helpers/setPropertiesRequired';

/**
 * Evaluators of types that create an object or read its properties, e.g. `Partial<Record<'top' | 'bottom', number>>`.
 */
export const objectEvaluators = {
  Omit: ([tsType, keysType], raw) => filterProperties(tsType, keysType, raw, (isListed) => !isListed),
  Partial: ([tsType], raw) => setPropertiesRequired(tsType, raw, false),
  Pick: ([tsType, keysType], raw) => filterProperties(
    tsType,
    keysType,
    raw,
    (isListed) => isListed,
    (otherType, keys) => pickFromOtherType(otherType, keysType, keys),
  ),
  PropsWithChildren: ([tsType], raw) => addChildrenProperty(tsType, raw),
  Record: ([keysType, valueType], raw) => {
    const keys = getLiteralKeys(keysType);

    if (keys) {
      return createObjectType(
        keys.map((key) => ({
          key,
          value: {
            ...valueType,
            required: true,
          },
        })),
        raw,
      );
    }

    if (['number', 'string'].includes(keysType.name)) {
      return createObjectType(
        [{
          key: `[key: ${keysType.name}]`,
          keyType: keysType,
          value: {
            ...valueType,
            required: false,
          },
        }],
        raw,
      );
    }

    return null;
  },
  Required: ([tsType], raw) => setPropertiesRequired(tsType, raw, true),
  indexedAccess: ([tsType, keysType], raw) => getPropertyTypes(tsType, keysType, raw),
  keyof: ([tsType], raw) => (
    isObjectType(tsType)
      ? createUnionType(tsType.signature.properties.flatMap(getPropertyKeyTypes), raw)
      : null
  ),
};
