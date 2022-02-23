// We do not want to install dependencies, this file is only here as example of prop table generation
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import React from 'react';
import {
  propTypes as commonPropTypes,
  defaultProps as commonDefaultProps,
} from './common.props';

const BaseGreeting = ({
  id,
  greeting,
  name,
  punctuation,
}) => (
  <strong id={id}>
    {greeting}
    ,
    {' '}
    {name}
    {punctuation}
  </strong>
);

BaseGreeting.defaultProps = {
  id: commonDefaultProps.id,
  punctuation: '.',
};

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
};

export default BaseGreeting;
