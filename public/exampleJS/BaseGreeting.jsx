import PropTypes from 'prop-types';
import React from 'react';
import { propTypes as commonPropTypes } from 'common.propTypes';
import { defaultProps as commonDefaultProps } from 'common.propTypes';

const BaseGreeting = ({
  greeting,
  name,
  punctuation,
}) => (
  <strong>{greeting}, {name}{punctuation}</strong>
);

BaseGreeting.defaultProps = {
  id: commonDefaultProps.id,
  punctuation: '.',
}

BaseGreeting.propTypes = {
  ...commonPropTypes,
  /**
   * The greeting to use
   */
  greeting: PropTypes.string.isRequired,
  id: commonPropTypes.id,
  /**
   * The name fo the person to greet
   */
  name: PropTypes.string.isRequired,
  /**
   * Sentence punctuation
   */
  punctuation: PropTypes.string,
}

export default BaseGreeting;
