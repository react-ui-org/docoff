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
  greeting,
  id,
  name,
}) => (
  <strong id={id}>
    {greeting}
    ,
    {' '}
    {name}
  </strong>
);

Greeting.defaultProps = {
  greeting: 'Hi',
  id: commonDefaultProps.id,
};

Greeting.propTypes = {
  greeting: commonPropTypes.greeting,
  id: commonPropTypes.id,
  /**
   * The name of the person to greet
   */
  name: PropTypes.string.isRequired,
};

export default Greeting;
