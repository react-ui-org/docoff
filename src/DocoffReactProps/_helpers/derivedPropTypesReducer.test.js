import { derivedPropTypesReducer } from './derivedPropTypesReducer';

describe('functionality', () => {
  it('drops props present in base definition and not present in overloading definition', () => {
    const basePropTypes = {
      propA: { description: 'base' },
    };

    const derivedPropTypes = {};
    const reducer = derivedPropTypesReducer(basePropTypes, derivedPropTypes);

    expect(Object.keys(derivedPropTypes).reduce(reducer, {})).toEqual({});
  });

  it('use overloading definition if it provides desceription', () => {
    const basePropTypes = {
      propA: { description: 'base' },
    };

    const derivedPropTypes = {
      propA: { description: 'derived' },
    };
    const reducer = derivedPropTypesReducer(basePropTypes, derivedPropTypes);

    expect(Object.keys(derivedPropTypes).reduce(reducer, {})).toEqual({
      propA: { description: 'derived' },
    });
  });

  it('use overloading defaultValue with base definition', () => {
    const basePropTypes = {
      propA: {
        defaultValue: 'base',
        description: 'base',
      },
    };

    const derivedPropTypes = {
      propA: { defaultValue: 'derived' },
    };
    const reducer = derivedPropTypesReducer(basePropTypes, derivedPropTypes);

    expect(Object.keys(derivedPropTypes).reduce(reducer, {})).toEqual({
      propA: {
        defaultValue: 'derived',
        description: 'base',
      },
    });
  });
});
