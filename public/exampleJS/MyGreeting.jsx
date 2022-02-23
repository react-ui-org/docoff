// We do not want to install dependencies, this file is only here as example of prop table generation
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import React from 'react';
import BaseGreeting from './BaseGreeting';

const MyGreeting = (props) => (
  <BaseGreeting greeting="Hello" {...props} />
);

MyGreeting.defaultProps = {
  id: BaseGreeting.defaultProps.id,
  punctuation: '!',
};

MyGreeting.propTypes = {
  id: BaseGreeting.props.id,
  /**
   * The name fo the person to greet
   */
  name: PropTypes.oneOf(['World', 'Moon']).isRequired,
  punctuation: BaseGreeting.props.punctuation,
};

export default MyGreeting;
