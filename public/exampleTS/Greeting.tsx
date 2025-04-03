// We do not want to install dependencies, this file is only here as example of prop table generation
// eslint-disable-next-line import/no-unresolved
import React from 'react';

import type { GreetingProps } from './Greeting.types';

/**
 * Greeting component
 */
const Greeting: React.FC<GreetingProps> = ({
  displayOptions,
  names,
  greeting = 'Hello',
  heading = null,
}) => {
  let headingEl = null;
  if (heading != null) {
    const HeadingTag = `h${heading.level}`
    headingEl = (
      <HeadingTag>
        {heading.text}
      </HeadingTag>
    );
  }

  const ContainerTag = displayOptions.bold ? 'strong' : 'span';
  return (
    <div
      stype={{
        'padding-top': displayOptions.margin.top,
        'padding-bottom': displayOptions.margin.bottom
      }}
    >
      {headingEl}
      <ContainerTag style={{ color: displayOptions.color }}>
        {greeting},
        {' '}
        {names.join(', ')}
      </ContainerTag>
    </div>
  );
};

export default Greeting;
