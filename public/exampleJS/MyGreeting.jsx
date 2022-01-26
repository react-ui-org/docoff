import PropTypes from 'prop-types';
import React from 'react';
import BaseGreeting from './BaseGreeting';

const MyGreeting = (props) => (
  <BaseGreeting greeting="Hello" { ...props }/>
);

MyGreeting.propTypes = {
  ...BaseGreeting.props.filter((prop) => prop === 'greeting'),
  // TODO: what to with greeting? Single option prop with default value? OR whitelist/blacklist?
  /**
   * The name fo the person to greet
   */
  name: PropTypes.oneOf(['World', 'Moon']).isRequired,
}

export default MyGreeting;
