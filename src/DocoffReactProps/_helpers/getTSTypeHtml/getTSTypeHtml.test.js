import { getTSTypeHtml } from './getTSTypeHtml';

describe('rendering', () => {
  it.each([
    { name: 'boolean' },
    { name: 'number' },
    { name: 'string' },
    { name: 'ReactNode' },
  ])('renders simple type definition: %s', (tsType) => {
    expect(getTSTypeHtml(tsType)).toEqual(`<code>${tsType.name}</code>`);
  });

  it.each([
    [
      {
        elements: [{ name: 'string' }],
        name: 'Array',
        raw: 'string[]',
      },
      'Array: <ul><li><code>string</code></li></ul>',
    ],
    [
      {
        name: 'signature',
        raw: '{ top: number, bottom?: number }',
        signature: {
          properties: [
            {
              key: 'top',
              value: {
                name: 'number',
                required: true,
              },
            },
            {
              key: 'bottom',
              value: {
                name: 'number',
                required: false,
              },
            },
          ],
        },
        type: 'object',
      },
      'Object: <ul><li>top*: <code>number</code></li><li>bottom: <code>number</code></li></ul>',
    ],
    [
      {
        name: 'signature',
        raw: '(value: Array<string>) => void',
        signature: {
          arguments: [
            {
              name: 'value',
              type: {
                elements: [{ name: 'string' }],
                name: 'Array',
                raw: 'Array<string>',
              },
            },
          ],
          return: { name: 'void' },
        },
        type: 'function',
      },
      '<code>(value: Array&lt;string>) => void</code>',
    ],
    [
      {
        name: 'literal',
        value: '\'small\'',
      },
      '<code>\'small\'</code>',
    ],
    [
      {
        elements: [
          {
            name: 'literal',
            value: '\'small\'',
          },
          { name: 'number' },
        ],
        name: 'union',
        raw: '\'small\' | number',
      },
      'Union: <ul><li><code>\'small\'</code></li><li><code>number</code></li></ul>',
    ],
    [
      {
        elements: [
          {
            elements: [
              {
                name: 'literal',
                value: '\'xs\'',
              },
              {
                name: 'literal',
                value: '\'sm\'',
              },
            ],
            name: 'union',
            raw: '\'xs\' | \'sm\'',
          },
          {
            name: 'literal',
            value: '\'none\'',
          },
        ],
        name: 'union',
        raw: 'Breakpoint | \'none\'',
      },
      'Union: <ul><li>Union: <ul><li><code>\'xs\'</code></li><li><code>\'sm\'</code></li></ul></li><li><code>\'none\'</code></li></ul>',
    ],
    [
      {
        elements: [
          { name: 'ButtonProps' },
          { name: 'LinkProps' },
        ],
        name: 'intersection',
        raw: 'ButtonProps & LinkProps',
      },
      '<code>ButtonProps &amp; LinkProps</code>',
    ],
    [
      {
        elements: [
          { name: 'string' },
          { name: 'number' },
        ],
        name: 'Record',
        raw: 'Record<string, number>',
      },
      '<code>Record&lt;string, number></code>',
    ],
    [
      {
        elements: [
          {
            elements: [
              {
                name: 'literal',
                value: '\'asc\'',
              },
              {
                name: 'literal',
                value: '\'desc\'',
              },
            ],
            name: 'union',
            raw: 'Direction',
          },
        ],
        name: 'Promise',
        raw: 'Promise<Direction>',
      },
      '<code>Promise&lt;\'asc\' | \'desc\'></code>',
    ],
  ])('renders complex type definition: %s', (tsType, expectedHtml) => {
    expect(getTSTypeHtml(tsType)).toEqual(expectedHtml);
  });

  it('escapes names of properties', () => {
    expect(getTSTypeHtml({
      name: 'signature',
      raw: '{ \'<b>\': number }',
      signature: {
        properties: [
          {
            key: '<b>',
            value: {
              name: 'number',
              required: true,
            },
          },
        ],
      },
      type: 'object',
    })).toEqual('Object: <ul><li>&lt;b>*: <code>number</code></li></ul>');
  });
});
