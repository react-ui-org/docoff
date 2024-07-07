// We do not want to install dependencies, this file is only here as example of prop table generation
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

export const propTypes = {
  /**
   * The greeting to use
   */
  greeting: PropTypes.string,

  /**
   * Component ID
   */
  id: PropTypes.string,

  /**
   * Unused prop
   */
  unused: PropTypes.string,
};

export const defaultProps = {
  greeting: 'Hello',
  id: undefined,
};

