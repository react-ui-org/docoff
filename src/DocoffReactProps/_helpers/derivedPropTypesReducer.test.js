import { derivedPropTypesReducer } from './derivedPropTypesReducer';

const basePropTypes = {
  propA: { description: 'base' },
  propB: { description: 'base' },
  propC: { description: 'base' },
};

const derivedPropTypes = {
  propA: { description: 'derived' },
  propB: { defaultValue: 'derived' },
  propC: {},
};

describe('rendering', () => {
  it('drops prop present in basePropTypes and not present in derivePropTypes', () => {
    const reducer = derivedPropTypesReducer(basePropTypes, derivedPropTypes);

    expect(Object.keys(derivedPropTypes).reduce(reducer, {})).toEqual({
      propA: { description: 'derived' },
      propB: {
        defaultValue: 'derived',
        description: 'base',
      },
    });
  });
});
