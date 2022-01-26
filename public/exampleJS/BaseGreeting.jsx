import PropTypes from 'prop-types';
import React from 'react';

const BaseGreeting = ({
  greeting,
  name,
  punctuation,
}) => (
  <strong>{greeting}, {name}{punctuation}</strong>
);

BaseGreeting.propTypes = {
  /**
   * The greeting to use
   */
  greeting: PropTypes.string.isRequired,
  /**
   * The name fo the person to greet
   */
  name: PropTypes.string.isRequired,
  /**
   * Sentence punctuation
   */
  punctuation: PropTypes.string.isRequired,
}

export default BaseGreeting;
