// We do not want to install dependencies, this file is only here as example of prop table generation
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import React from 'react';
import {
  propTypes as commonPropTypes,
  defaultProps as commonDefaultProps,
} from './common.props';

const Greeting = ({
  bold,
  greeting,
  id,
  name,
}) => {
  const Tag = bold ? 'strong' : 'span';
  return (
    <Tag id={id}>
      {greeting}
      ,
      {' '}
      {name}
    </Tag>
  );
};

Greeting.defaultProps = {
  bold: false,
  greeting: 'Hi',
  id: commonDefaultProps.id,
};

Greeting.propTypes = {
  /**
   * Whether to use bold text
   */
  bold: PropTypes.bool,

  greeting: commonPropTypes.greeting,

  id: commonPropTypes.commonId,

  /**
   * The name of the person to greet
   */
  name: PropTypes.string.isRequired,
};

export default Greeting;
