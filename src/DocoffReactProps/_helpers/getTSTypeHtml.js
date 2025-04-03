export const getTSTypeHtml = (tsType) => {
  if (tsType.name === 'Array') {
    const listItems = tsType.elements.reduce(
      (acc, el) => `${acc}<li>${getTSTypeHtml(el)}</li>`,
      '',
    );

    return `Array: <ul>${listItems}</ul>`;
  }

  if (tsType.name === 'signature') {
    const listItems = tsType.signature.properties.reduce(
      (acc, el) => `${acc}<li>${el.key}${el.value.required ? '*' : ''}: ${getTSTypeHtml(el.value)}</li>`,
      '',
    );

    return `Object: <ul>${listItems}</ul>`;
  }

  return `${tsType.name}`;
};
