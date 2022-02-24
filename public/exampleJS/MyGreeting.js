// We do not want to install dependencies, this file is only here as example of prop table generation
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import BaseGreeting from './BaseGreeting';

// For better performance we wrap the `BaseGreeting` on JS level without creating another component
const MyGreeting = (props) => BaseGreeting({
  ...props,
  greeting: 'Hello',
});

const defaultProps = {
  id: BaseGreeting.defaultProps.id,
  punctuation: '!',
};

const propTypes = {
  id: BaseGreeting.props.id,
  /**
   * Whom to greet
   */
  name: PropTypes.oneOf(['World', 'Moon']).isRequired,
  punctuation: BaseGreeting.props.punctuation,
};

MyGreeting.propsTypes = propTypes;
MyGreeting.defaultProps = defaultProps;

export default MyGreeting;
