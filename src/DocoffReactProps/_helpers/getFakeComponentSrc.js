// If the file suffix is `*.props.js` we know it is a prop definition file.
// Since react-docgen can only parse components, we create a fake component.
export const getFakeComponentSrc = (componentSrc, componentName) => `
  import React from 'react';
  ${componentSrc}
  export const ${componentName} = () => (<span />);
  ${componentName}.propTypes = propTypes;
  ${componentName}.defaultProps = defaultProps;
`;
