import { getPropTypeHtml } from './getPropTypeHtml';

describe('rendering', () => {
  it.each([
    { name: 'array' },
    { name: 'any' },
    { name: 'bigint' },
    { name: 'bool' },
    { name: 'element' },
    { name: 'elementType' },
    { name: 'func' },
    { name: 'number' },
    { name: 'object' },
    { name: 'string' },
    { name: 'symbol' },
    { name: 'node' },
  ])('renders simple prop definition: %s', (propType) => {
    expect(getPropTypeHtml(propType)).toEqual(propType.name);
  });

  it.each([
    [
      {
        name: 'instanceOf',
        value: 'Error',
      },
      'instanceOf<ul><li>Error</li></ul>',
    ],
    [
      {
        name: 'enum',
        value: [{ value: 'value' }],
      },
      'enum<ul><li>value</li></ul>',
    ],
    [
      {
        name: 'union',
        value: [
          { name: 'nameA' },
          {
            name: 'union',
            value: { name: 'nameB' },
          },
        ],
      },
      'union<ul><li>nameA</li><li>union<ul><li>nameB</li></ul></li></ul>',
    ],
    [
      {
        name: 'arrayOf',
        value: { name: 'name' },
      },
      'arrayOf<ul><li>name</li></ul>',
    ],
    [
      {
        name: 'arrayOf',
        value: {
          name: 'arrayOf',
          value: { name: 'name' },
        },
      },
      'arrayOf<ul><li>arrayOf<ul><li>name</li></ul></li></ul>',
    ],
    [
      {
        name: 'objectOf',
        value: { name: 'name' },
      },
      'objectOf<ul><li>name</li></ul>',
    ],
    [
      {
        name: 'objectOf',
        value: {
          name: 'objectOf',
          value: { name: 'name' },
        },
      },
      'objectOf<ul><li>objectOf<ul><li>name</li></ul></li></ul>',
    ],
    [
      {
        name: 'shape',
        value: {
          nested: {
            name: 'shape',
            value: {
              inner: { name: 'nameC' },
            },
          },
          optional: { name: 'nameA' },
          required: {
            name: 'nameB',
            required: true,
          },
        },
      },
      'shape<ul><li>nested: shape<ul><li>inner: nameC</li></ul></li><li>optional: nameA</li><li>required*: nameB</li></ul>',
    ],
    [
      {
        name: 'exact',
        value: {
          nested: {
            name: 'exact',
            value: {
              inner: { name: 'nameC' },
            },
          },
          optional: { name: 'nameA' },
          required: {
            name: 'nameB',
            required: true,
          },
        },
      },
      'exact<ul><li>nested: exact<ul><li>inner: nameC</li></ul></li><li>optional: nameA</li><li>required*: nameB</li></ul>',
    ],
    [
      {
        name: 'custom',
        raw: '() => console.log(\n  \'XX\'\n)',
      },
      'custom<ul><li><pre><code>() => console.log(\n  \'XX\'\n)</code></pre></li></ul>',
    ],
  ])('renders complex prop definition: %s', (propType, html) => {
    expect(getPropTypeHtml(propType)).toEqual(html);
  });
});
