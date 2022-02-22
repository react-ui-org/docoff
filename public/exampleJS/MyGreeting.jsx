import PropTypes from 'prop-types';
import React from 'react';
import BaseGreeting from './BaseGreeting';

const MyGreeting = (props) => (
  <BaseGreeting greeting="Hello" { ...props }/>
);

MyGreeting.defaultProps = {
  id: BaseGreeting.defaultProps.id,
  punctuation: '!',
}

MyGreeting.propTypes = {
  id: BaseGreeting.props.id,
  punctuation: BaseGreeting.props.punctuation,
  /**
   * The name fo the person to greet
   */
  name: PropTypes.oneOf(['World', 'Moon']).isRequired,
}

export default MyGreeting;
