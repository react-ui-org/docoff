import PropTypes from 'prop-types';
import React from 'react';
import BaseGreeting from './BaseGreeting';
import { propTypes as commonPropTypes } from './common.props';

const MyGreeting = (props) => (
  <BaseGreeting greeting="Hello" { ...props }/>
);

MyGreeting.defaultProps = {
  id: BaseGreeting.defaultProps.id,
  punctuation: '!',
}

MyGreeting.propTypes = {
  id: BaseGreeting.props.id,
  /**
   * The name fo the person to greet
   */
  name: PropTypes.oneOf(['World', 'Moon']).isRequired,
  punctuation: BaseGreeting.props.punctuation,
}

export default MyGreeting;
