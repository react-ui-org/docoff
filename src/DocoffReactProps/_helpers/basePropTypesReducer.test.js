import { basePropTypesReducer } from './basePropTypesReducer';

const basePropTypes = {
  propA: {},
  propB: {},
};

const derivedPropNames = ['propA'];

describe('rendering', () => {
  it('drops prop present in basePropTypes and not present in derivePropTypes', () => {
    const reducer = basePropTypesReducer(basePropTypes, derivedPropNames);

    expect(Object.keys(basePropTypes).reduce(reducer, {})).toEqual({ propA: {} });
  });
});
