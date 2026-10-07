import { evaluateTSType } from './evaluateTSType';

const literal = (value) => ({
  name: 'literal',
  value: `'${value}'`,
});

const union = (...elements) => ({
  elements,
  name: 'union',
  raw: 'union',
});

const INDEX_SIGNATURE_KEY_REGEX = /^\[key: (.+)\]$/;

const object = (properties, raw = 'object') => ({
  name: 'signature',
  raw,
  signature: {
    properties: Object.entries(properties).map(([key, value]) => {
      // Index signature, e.g. `[key: string]`, is described by the type of its keys as well
      const keyTypeName = INDEX_SIGNATURE_KEY_REGEX.exec(key)?.[1];

      return {
        key,
        ...(keyTypeName && { keyType: { name: keyTypeName } }),
        value,
      };
    }),
  },
  type: 'object',
});

const utility = (name, ...elements) => ({
  elements,
  name,
  raw: name,
});

const required = (tsType) => ({
  ...tsType,
  required: true,
});

const optional = (tsType) => ({
  ...tsType,
  required: false,
});

describe('functionality', () => {
  it.each([
    { name: 'string' },
    literal('small'),
    union(literal('small'), { name: 'number' }),
    object({ top: required({ name: 'number' }) }),
    utility('RefObject', { name: 'HTMLButtonElement' }),
    {
      elements: [
        { name: 'string' },
        utility('NonNullable', { name: 'unknown' }),
      ],
      name: 'intersection',
      raw: 'string & NonNullable<unknown>',
    },
  ])('keeps type that is not to be evaluated: %s', (tsType) => {
    expect(evaluateTSType(tsType)).toEqual(tsType);
  });

  it('evaluates `Record` with literal keys', () => {
    expect(evaluateTSType(utility('Record', union(literal('bottom'), literal('top')), { name: 'number' })))
      .toEqual(object(
        {
          bottom: required({ name: 'number' }),
          top: required({ name: 'number' }),
        },
        'Record',
      ));
  });

  it('evaluates `Record` with any keys', () => {
    expect(evaluateTSType(utility('Record', { name: 'string' }, { name: 'unknown' })))
      .toEqual(object({ '[key: string]': optional({ name: 'unknown' }) }, 'Record'));
  });

  it('keeps `Record` with keys that are not known', () => {
    const tsType = utility('Record', { name: 'Breakpoint' }, { name: 'number' });

    expect(evaluateTSType(tsType)).toEqual(tsType);
  });

  it('evaluates nested utility types', () => {
    expect(evaluateTSType(union(
      { name: 'string' },
      utility('Partial', utility('Record', union(literal('lg'), union(literal('md'), literal('sm'))), { name: 'string' })),
    ))).toEqual(union(
      { name: 'string' },
      object(
        {
          lg: optional({ name: 'string' }),
          md: optional({ name: 'string' }),
          sm: optional({ name: 'string' }),
        },
        'Partial',
      ),
    ));
  });

  it('evaluates `Partial` and `Required`', () => {
    const tsType = object({
      bottom: optional({ name: 'number' }),
      top: required({ name: 'number' }),
    });

    expect(evaluateTSType(utility('Partial', tsType))).toEqual(object(
      {
        bottom: optional({ name: 'number' }),
        top: optional({ name: 'number' }),
      },
      'Partial',
    ));
    expect(evaluateTSType(utility('Required', tsType))).toEqual(object(
      {
        bottom: required({ name: 'number' }),
        top: required({ name: 'number' }),
      },
      'Required',
    ));
  });

  it('keeps index signature optional in `Required`', () => {
    expect(evaluateTSType(utility('Required', utility('Record', { name: 'string' }, { name: 'number' }))))
      .toEqual(object({ '[key: string]': optional({ name: 'number' }) }, 'Required'));
  });

  it('evaluates `Readonly`', () => {
    expect(evaluateTSType(utility('Readonly', { name: 'string' }))).toEqual({ name: 'string' });
  });

  it('evaluates `Pick` and `Omit`', () => {
    const tsType = object({
      bottom: optional({ name: 'number' }),
      color: optional({ name: 'string' }),
      top: required({ name: 'number' }),
    });

    expect(evaluateTSType(utility('Pick', tsType, union(literal('top'), literal('color'))))).toEqual(object(
      {
        color: optional({ name: 'string' }),
        top: required({ name: 'number' }),
      },
      'Pick',
    ));
    expect(evaluateTSType(utility('Omit', tsType, literal('color')))).toEqual(object(
      {
        bottom: optional({ name: 'number' }),
        top: required({ name: 'number' }),
      },
      'Omit',
    ));
  });

  it('evaluates `Exclude` and `Extract`', () => {
    const tsType = union(union(literal('filled'), literal('outline')), literal('flat'));

    expect(evaluateTSType(utility('Exclude', tsType, literal('flat')))).toEqual({
      elements: [literal('filled'), literal('outline')],
      name: 'union',
      raw: 'Exclude',
    });
    expect(evaluateTSType(utility('Extract', tsType, union(literal('flat'), literal('link')))))
      .toEqual(literal('flat'));
    expect(evaluateTSType(utility('Exclude', literal('flat'), literal('flat')))).toEqual({ name: 'never' });
    // Primitive type is never one of the listed members
    expect(evaluateTSType(utility('Exclude', union({ name: 'string' }, { name: 'undefined' }), { name: 'undefined' })))
      .toEqual({ name: 'string' });
    expect(evaluateTSType(utility('Extract', union({ name: 'number' }, literal('auto')), literal('auto'))))
      .toEqual(literal('auto'));
  });

  it.each([
    utility('Exclude', union(literal('flat'), { name: 'number' }), { name: 'string' }),
    utility('Extract', union(utility('keyof', { name: 'HTMLElementTagNameMap' }), literal('none')), literal('a')),
    utility('Exclude', { name: 'boolean' }, literal('false')),
  ])('keeps `Exclude` and `Extract` of type that cannot be compared: %s', (tsType) => {
    expect(evaluateTSType(tsType)).toEqual(tsType);
  });

  it('evaluates `NonNullable`', () => {
    expect(evaluateTSType(utility('NonNullable', union({ name: 'string' }, { name: 'null' }, { name: 'undefined' }))))
      .toEqual({ name: 'string' });
    expect(evaluateTSType(utility('NonNullable', { name: 'null' }))).toEqual({ name: 'never' });
  });

  it('evaluates union of unions of literals', () => {
    expect(evaluateTSType(union(
      union(literal('primary'), literal('secondary')),
      union(literal('light'), union(literal('dark'))),
      literal('none'),
    ))).toEqual(union(
      literal('primary'),
      literal('secondary'),
      literal('light'),
      literal('dark'),
      literal('none'),
    ));
  });

  it('keeps union of literals nested in union with other types', () => {
    const tsType = union(union(literal('auto'), literal('limited')), { name: 'string' });

    expect(evaluateTSType(tsType)).toEqual(tsType);
  });

  it.each([
    ['Uppercase', '\'SM-UP\''],
    ['Lowercase', '\'sm-up\''],
    ['Capitalize', '\'Sm-Up\''],
    ['Uncapitalize', '\'sm-Up\''],
  ])('evaluates `%s`', (name, expectedValue) => {
    expect(evaluateTSType(utility(name, literal('sm-Up')))).toEqual({
      name: 'literal',
      value: expectedValue,
    });
  });

  it('keeps `Uppercase` of type that is not a literal', () => {
    const tsType = utility('Uppercase', { name: 'string' });

    expect(evaluateTSType(tsType)).toEqual(tsType);
  });

  it('evaluates `NoInfer`, `Awaited` and `ReadonlyArray`', () => {
    expect(evaluateTSType(utility('NoInfer', { name: 'string' }))).toEqual({ name: 'string' });
    expect(evaluateTSType(utility('Awaited', utility('Promise', utility('Promise', { name: 'string' })))))
      .toEqual({ name: 'string' });
    expect(evaluateTSType(utility('Awaited', { name: 'number' }))).toEqual({ name: 'number' });
    expect(evaluateTSType(utility('Awaited', union(utility('Promise', { name: 'string' }), { name: 'number' }))))
      .toEqual(union({ name: 'string' }, { name: 'number' }));
    expect(evaluateTSType(utility('ReadonlyArray', { name: 'string' }))).toEqual({
      elements: [{ name: 'string' }],
      name: 'Array',
      raw: 'ReadonlyArray',
    });
  });

  it('evaluates `PropsWithChildren`', () => {
    expect(evaluateTSType(utility('PropsWithChildren', object({ label: required({ name: 'string' }) })))).toEqual(object(
      {
        label: required({ name: 'string' }),
        // eslint-disable-next-line sort-keys
        children: optional({ name: 'ReactNode' }),
      },
      'PropsWithChildren',
    ));
  });

  it('keeps children defined by type wrapped in `PropsWithChildren`', () => {
    expect(evaluateTSType(utility('PropsWithChildren', object({ children: required({ name: 'string' }) }))))
      .toEqual(object({ children: required({ name: 'string' }) }, 'PropsWithChildren'));
  });

  it('evaluates `PropsWithChildren` of intersection with a type that is not known', () => {
    const tsType = {
      elements: [
        { name: 'HTMLAttributes' },
        object({ label: required({ name: 'string' }) }),
      ],
      name: 'intersection',
      raw: 'intersection',
    };

    expect(evaluateTSType(utility('PropsWithChildren', tsType))).toEqual({
      ...tsType,
      elements: [
        ...tsType.elements,
        object({ children: optional({ name: 'ReactNode' }) }, 'PropsWithChildren'),
      ],
      raw: 'PropsWithChildren',
    });
    expect(evaluateTSType(utility('PropsWithChildren', { name: 'HTMLAttributes' })))
      .toEqual(utility('PropsWithChildren', { name: 'HTMLAttributes' }));
  });

  it('evaluates types of objects that are a part of an intersection with a type that is not known', () => {
    const tsType = {
      elements: [
        utility('Omit', { name: 'HTMLAttributes' }, literal('color')),
        object({
          color: optional({ name: 'string' }),
          label: required({ name: 'string' }),
        }),
      ],
      name: 'intersection',
      raw: 'intersection',
    };

    expect(evaluateTSType(utility('Omit', tsType, literal('label'))).elements).toEqual([
      tsType.elements[0],
      object({ color: optional({ name: 'string' }) }, 'Omit'),
    ]);
    expect(evaluateTSType(utility('Required', tsType)).elements[1]).toEqual(object(
      {
        color: required({ name: 'string' }),
        label: required({ name: 'string' }),
      },
      'Required',
    ));
  });

  it('evaluates types of objects that are a part of a nested intersection', () => {
    const tsType = {
      elements: [
        {
          elements: [
            { name: 'HTMLAttributes' },
            object({
              id: required({ name: 'string' }),
              label: required({ name: 'string' }),
            }),
          ],
          name: 'intersection',
          raw: 'intersection',
        },
        object({ size: optional({ name: 'number' }) }),
      ],
      name: 'intersection',
      raw: 'intersection',
    };

    expect(evaluateTSType(utility('Omit', tsType, literal('id')))).toEqual({
      elements: [
        { name: 'HTMLAttributes' },
        object({ label: required({ name: 'string' }) }, 'Omit'),
        object({ size: optional({ name: 'number' }) }, 'Omit'),
      ],
      name: 'intersection',
      raw: 'Omit',
    });
  });

  it('picks from type that is not known in `Pick` of intersection', () => {
    const tsType = (otherType) => ({
      elements: [
        otherType,
        object({
          color: optional({ name: 'string' }),
          label: required({ name: 'string' }),
        }),
      ],
      name: 'intersection',
      raw: 'intersection',
    });

    expect(evaluateTSType(utility('Pick', tsType({ name: 'HTMLAttributes' }), literal('color')))).toEqual({
      elements: [
        {
          elements: [{ name: 'HTMLAttributes' }, literal('color')],
          name: 'Pick',
          raw: 'Pick<HTMLAttributes, \'color\'>',
        },
        object({ color: optional({ name: 'string' }) }, 'Pick'),
      ],
      name: 'intersection',
      raw: 'Pick',
    });
    // Type that omits all the picked keys has none of them
    expect(evaluateTSType(utility(
      'Pick',
      tsType(utility('Omit', { name: 'HTMLAttributes' }, union(literal('color'), literal('type')))),
      literal('color'),
    ))).toEqual(object({ color: optional({ name: 'string' }) }, 'Pick'));
  });

  it('evaluates `keyof` of object', () => {
    expect(evaluateTSType(utility('keyof', object({
      bottom: optional({ name: 'number' }),
      top: required({ name: 'number' }),
    })))).toEqual({
      elements: [literal('bottom'), literal('top')],
      name: 'union',
      raw: 'keyof',
    });
  });

  it('evaluates `keyof` of object with keys that contain quotes', () => {
    expect(evaluateTSType(utility('keyof', object({
      'it\'s': required({ name: 'string' }),
      'say "hi"': required({ name: 'string' }),
    })))).toEqual({
      elements: [
        {
          name: 'literal',
          value: '"it\'s"',
        },
        {
          name: 'literal',
          value: '"say \\"hi\\""',
        },
      ],
      name: 'union',
      raw: 'keyof',
    });
  });

  it('evaluates `Pick` and `Omit` of keys that contain quotes', () => {
    const tsType = object({
      'it\'s': required({ name: 'string' }),
      'say "hi"': required({ name: 'string' }),
      top: required({ name: 'number' }),
    });

    expect(evaluateTSType(utility('Pick', tsType, union(
      {
        name: 'literal',
        value: '\'it\\\'s\'',
      },
      {
        name: 'literal',
        value: '"say \\"hi\\""',
      },
    )))).toEqual(object(
      {
        'it\'s': required({ name: 'string' }),
        'say "hi"': required({ name: 'string' }),
      },
      'Pick',
    ));
    // Keys read by `keyof` are written with escaped characters
    expect(evaluateTSType(utility('Omit', tsType, utility('keyof', object({
      'say "hi"': required({ name: 'string' }),
    }))))).toEqual(object(
      {
        'it\'s': required({ name: 'string' }),
        top: required({ name: 'number' }),
      },
      'Omit',
    ));
  });

  it('evaluates `keyof` of object with index signature', () => {
    expect(evaluateTSType(utility('keyof', object({
      '[key: string]': optional({ name: 'unknown' }),
      id: required({ name: 'string' }),
    })))).toEqual({
      elements: [{ name: 'string' }, { name: 'number' }, literal('id')],
      name: 'union',
      raw: 'keyof',
    });
    expect(evaluateTSType(utility('keyof', utility('Record', { name: 'number' }, { name: 'string' }))))
      .toEqual({ name: 'number' });
  });

  it('evaluates `indexedAccess` of object', () => {
    const tsType = {
      elements: [
        { name: 'HTMLAttributes' },
        object({
          label: required({ name: 'string' }),
          size: optional(union(literal('small'), literal('large'))),
        }),
      ],
      name: 'intersection',
      raw: 'intersection',
    };

    expect(evaluateTSType(utility('indexedAccess', tsType, literal('label')))).toEqual({ name: 'string' });
    // Optional property can be `undefined`
    expect(evaluateTSType(utility('indexedAccess', tsType, literal('size')))).toEqual({
      elements: [literal('small'), literal('large'), { name: 'undefined' }],
      name: 'union',
      raw: 'indexedAccess',
    });
    expect(evaluateTSType(utility('indexedAccess', tsType, union(literal('label'), literal('size'))))).toEqual({
      elements: [{ name: 'string' }, literal('small'), literal('large'), { name: 'undefined' }],
      name: 'union',
      raw: 'indexedAccess',
    });
  });

  it('keeps `indexedAccess` of property that is not known', () => {
    const tsType = utility('indexedAccess', object({ label: required({ name: 'string' }) }), literal('onClick'));

    expect(evaluateTSType(tsType)).toEqual(tsType);
  });

  it('keeps `keyof` of type that is not known', () => {
    const tsType = utility('keyof', { name: 'HTMLElementTagNameMap' });

    expect(evaluateTSType(tsType)).toEqual(tsType);
  });

  it('names properties of mapped type and index signature', () => {
    expect(evaluateTSType({
      name: 'signature',
      raw: 'object',
      signature: {
        properties: [
          {
            key: {
              ...union(literal('sm'), literal('xs')),
              required: false,
            },
            value: { name: 'number' },
          },
          {
            key: { name: 'string' },
            value: required({ name: 'boolean' }),
          },
        ],
      },
      type: 'object',
    })).toEqual(object({
      sm: optional({ name: 'number' }),
      xs: optional({ name: 'number' }),
      // eslint-disable-next-line sort-keys
      '[key: string]': optional({ name: 'boolean' }),
    }));
  });

  it('evaluates intersection of objects', () => {
    expect(evaluateTSType({
      elements: [
        utility('Record', { name: 'string' }, { name: 'unknown' }),
        object({ id: required({ name: 'string' }) }),
      ],
      name: 'intersection',
      raw: 'intersection',
    })).toEqual(object(
      {
        '[key: string]': optional({ name: 'unknown' }),
        id: required({ name: 'string' }),
      },
      'intersection',
    ));
  });

  it('intersects definitions of a property in intersection of objects', () => {
    expect(evaluateTSType({
      elements: [
        object({
          id: optional({ name: 'string' }),
          label: optional({ name: 'ReactNode' }),
          margin: optional(object({ top: required({ name: 'number' }) })),
        }),
        object({
          id: required({ name: 'string' }),
          label: required({ name: 'string' }),
          margin: optional(object({ bottom: optional({ name: 'number' }) })),
        }),
      ],
      name: 'intersection',
      raw: 'intersection',
    })).toEqual(object(
      {
        id: required({ name: 'string' }),
        label: required({
          elements: [optional({ name: 'ReactNode' }), required({ name: 'string' })],
          name: 'intersection',
          raw: 'ReactNode & string',
        }),
        margin: optional(object(
          {
            top: required({ name: 'number' }),
            // eslint-disable-next-line sort-keys
            bottom: optional({ name: 'number' }),
          },
          '{ top: number } & { bottom?: number }',
        )),
      },
      'intersection',
    ));
  });

  describe('configuration', () => {
    const responsiveType = utility('Partial', utility('Record', union(literal('sm'), literal('xs')), { name: 'number' }));

    it('leaves type that is turned off as it is', () => {
      expect(evaluateTSType(responsiveType, { evaluateTypes: { Partial: false } })).toEqual(utility(
        'Partial',
        object(
          {
            sm: required({ name: 'number' }),
            xs: required({ name: 'number' }),
          },
          'Record',
        ),
      ));
    });

    it('evaluates type by custom function', () => {
      const evaluatePartial = jest.fn(() => ({ name: 'ResponsiveValue' }));

      expect(evaluateTSType(responsiveType, { evaluateTypes: { Partial: evaluatePartial } }))
        .toEqual({ name: 'ResponsiveValue' });
      expect(evaluatePartial).toHaveBeenCalledWith(utility(
        'Partial',
        object(
          {
            sm: required({ name: 'number' }),
            xs: required({ name: 'number' }),
          },
          'Record',
        ),
      ));
    });

    it('evaluates type that has no default evaluation by custom function', () => {
      expect(evaluateTSType(
        union({ name: 'ReactNode' }, { name: 'string' }),
        { evaluateTypes: { ReactNode: () => ({ name: 'node' }) } },
      )).toEqual(union({ name: 'node' }, { name: 'string' }));
    });

    it('keeps type when custom function returns nothing', () => {
      expect(evaluateTSType({ name: 'ReactNode' }, { evaluateTypes: { ReactNode: () => undefined } }))
        .toEqual({ name: 'ReactNode' });
    });

    it('expands function signatures unless turned off', () => {
      const tsType = {
        name: 'signature',
        raw: '(direction: Exclude<Direction, \'none\'>) => void',
        signature: {
          arguments: [{
            name: 'direction',
            type: utility('Exclude', union(literal('asc'), literal('desc'), literal('none')), literal('none')),
          }],
          return: { name: 'void' },
        },
        type: 'function',
      };

      expect(evaluateTSType(tsType).raw).toEqual('(direction: \'asc\' | \'desc\') => void');
      expect(evaluateTSType(object({ onClick: required(tsType) })).signature.properties[0].value.raw)
        .toEqual('(direction: \'asc\' | \'desc\') => void');
      expect(evaluateTSType(tsType, { expandFunctionSignatures: false })).toEqual(tsType);
    });

    it('does not merge unions of literals when turned off', () => {
      const tsType = union(union(literal('primary'), literal('secondary')), literal('none'));

      expect(evaluateTSType(tsType, { mergeLiteralUnions: false })).toEqual(tsType);
    });

    it('does not merge intersection of objects when turned off', () => {
      const tsType = {
        elements: [
          object({ id: required({ name: 'string' }) }),
          object({ label: required({ name: 'string' }) }),
        ],
        name: 'intersection',
        raw: 'intersection',
      };

      expect(evaluateTSType(tsType, { mergeObjectIntersections: false })).toEqual(tsType);
    });
  });

  it('evaluates types of object properties and keeps whether they are required', () => {
    expect(evaluateTSType(object({
      priority: optional(utility('Exclude', union(literal('filled'), literal('flat')), literal('flat'))),
    }))).toEqual(object({ priority: optional(literal('filled')) }));
  });
});
