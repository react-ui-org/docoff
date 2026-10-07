import { utils } from 'react-docgen';
import { getPropsWithChildrenPath } from './_helpers/getPropsWithChildrenPath';

/**
 * Handler of `react-docgen` that describes the types of props of the component as a whole. By default, only
 * the types of the individual props are described, which leaves out the props defined by e.g. `Omit<Props, 'label'>`.
 *
 * @param {Object} documentation The documentation of the component
 * @param {Object} componentDefinition The path to the definition of the component
 */
export const propsTypeHandler = (documentation, componentDefinition) => {
  documentation.set(
    'propsTypes',
    utils.getTypeFromReactComponent(componentDefinition)
      .map((typePath) => utils.getTSType(getPropsWithChildrenPath(typePath))),
  );
};
