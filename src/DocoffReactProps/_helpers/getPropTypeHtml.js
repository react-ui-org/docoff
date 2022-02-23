export const getPropTypeHtml = (type) => {
  const getValue = () => {
    if (type.name === 'custom') {
      return `<ul><li><pre><code>${type.raw}</code></pre></li></ul>`;
    }

    if (!type.value) {
      return '';
    }

    if (type.name === 'instanceOf') {
      return `<ul><li>${type.value}</li></ul>`;
    }

    if (['shape', 'exact'].includes(type.name)) {
      const listItems = Object.keys(type.value).reduce(
        (acc, el) => `${acc}<li>${el}${type.value[el].required ? '*' : ''}: ${getPropTypeHtml(type.value[el])}</li>`,
        '',
      );

      return `<ul>${listItems}</ul>`;
    }

    if (Array.isArray(type.value)) {
      const listItems = type.value.reduce(
        (acc, el) => `${acc}<li>${el.name ? getPropTypeHtml(el) : el.value}</li>`,
        '',
      );

      return `<ul>${listItems}</ul>`;
    }

    return `<ul><li>${getPropTypeHtml(type.value)}</li></ul>`;
  };

  return `${type.name}${getValue(type)}`;
};
