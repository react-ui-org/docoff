import { getTSTypeText } from './getTSTypeText';

const literal = (value) => ({
  name: 'literal',
  value: `'${value}'`,
});

const direction = {
  elements: [literal('asc'), literal('desc')],
  name: 'union',
  raw: '\'asc\' | \'desc\'',
};

const fn = (raw, parameters, returnType = { name: 'void' }) => ({
  name: 'signature',
  raw,
  signature: {
    arguments: parameters,
    return: returnType,
  },
  type: 'function',
});

describe('rendering', () => {
  it.each([
    [{ name: 'string' }, 'string'],
    [literal('asc'), '\'asc\''],
    [direction, '\'asc\' | \'desc\''],
    [
      {
        elements: [direction],
        name: 'Array',
        raw: 'Direction[]',
      },
      '(\'asc\' | \'desc\')[]',
    ],
    [
      {
        elements: [{ name: 'string' }],
        name: 'Array',
        raw: 'Array<string>',
      },
      'string[]',
    ],
    [
      {
        elements: [direction, { name: 'number' }],
        name: 'tuple',
        raw: '[Direction, number]',
      },
      '[\'asc\' | \'desc\', number]',
    ],
    [
      {
        elements: [{ name: 'unknown' }, { name: 'unknown' }],
        name: 'tuple',
        raw: '[start: number, end?: number]',
      },
      '[start: number, end?: number]',
    ],
    [
      {
        elements: [direction],
        name: 'Promise',
        raw: 'Promise<Direction>',
      },
      'Promise<\'asc\' | \'desc\'>',
    ],
    [
      {
        elements: [{ name: 'string' }, direction],
        name: 'intersection',
        raw: 'string & Direction',
      },
      'string & (\'asc\' | \'desc\')',
    ],
    [
      {
        elements: [{ name: 'HTMLElementTagNameMap' }],
        name: 'keyof',
        raw: 'keyof HTMLElementTagNameMap',
      },
      'keyof HTMLElementTagNameMap',
    ],
    [
      {
        name: 'signature',
        raw: 'Row',
        signature: {
          properties: [
            {
              key: 'id',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'direction',
              value: {
                ...direction,
                required: false,
              },
            },
          ],
        },
        type: 'object',
      },
      '{ id: string; direction?: \'asc\' | \'desc\' }',
    ],
    [
      {
        name: 'signature',
        raw: 'Record<string, unknown>',
        signature: {
          properties: [
            {
              key: '[key: string]',
              keyType: { name: 'string' },
              value: {
                name: 'unknown',
                required: false,
              },
            },
          ],
        },
        type: 'object',
      },
      '{ [key: string]: unknown }',
    ],
  ])('renders type: %s', (tsType, expectedText) => {
    expect(getTSTypeText(tsType)).toEqual(expectedText);
  });

  it.each([
    [
      'with evaluated types',
      fn(
        '(column: string, direction: Direction) => void',
        [
          {
            name: 'column',
            type: { name: 'string' },
          },
          {
            name: 'direction',
            type: direction,
          },
        ],
      ),
      '(column: string, direction: \'asc\' | \'desc\') => void',
    ],
    [
      'with optional and rest parameters',
      fn(
        '(direction?: Direction, ...columns: Array<[string, number]>) => Direction',
        [
          {
            name: 'direction',
            type: direction,
          },
          {
            name: 'columns',
            rest: true,
            type: {
              elements: [{
                elements: [{ name: 'string' }, { name: 'number' }],
                name: 'tuple',
                raw: '[string, number]',
              }],
              name: 'Array',
              raw: 'Array<[string, number]>',
            },
          },
        ],
        direction,
      ),
      '(direction?: \'asc\' | \'desc\', ...columns: [string, number][]) => \'asc\' | \'desc\'',
    ],
    [
      'with callback parameter',
      fn(
        '(callback: (direction: Direction) => void, label: \'a, b\') => void',
        [
          {
            name: 'callback',
            type: fn(
              '(direction: Direction) => void',
              [{
                name: 'direction',
                type: direction,
              }],
            ),
          },
          {
            name: 'label',
            type: literal('a, b'),
          },
        ],
      ),
      '(callback: (direction: \'asc\' | \'desc\') => void, label: \'a, b\') => void',
    ],
    [
      'without parameters',
      fn('() => Direction', [], direction),
      '() => \'asc\' | \'desc\'',
    ],
    [
      'written as method',
      fn(
        '(direction?: Direction): void',
        [{
          name: 'direction',
          type: direction,
        }],
      ),
      '(direction?: \'asc\' | \'desc\') => void',
    ],
  ])('renders function %s', (description, tsType, expectedText) => {
    expect(getTSTypeText(tsType)).toEqual(expectedText);
  });

  it.each([
    [
      'generic function',
      fn(
        '<Value>(value: Value) => Value',
        [{
          name: 'value',
          type: { name: 'Value' },
        }],
        { name: 'Value' },
      ),
    ],
    [
      'function with destructured parameter',
      fn(
        '({ id, label }: Row) => void',
        [{
          name: '',
          type: { name: 'Row' },
        }],
      ),
    ],
    [
      'function with parameter that has no type',
      fn('(value) => void', [{ name: 'value' }]),
    ],
  ])('keeps %s as it is written', (description, tsType) => {
    expect(getTSTypeText(tsType)).toEqual(tsType.raw);
  });
});
