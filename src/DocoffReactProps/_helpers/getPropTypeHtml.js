export const getPropTypeHtml = (type) => {
    const getValue = () => {
        if (!type.value) {
            return '';
        }

        if (type.name === 'shape') {
            return `
                <ul>
                    ${Object.keys(type.value).reduce(
                        (acc, el) => `${acc}<li>${el}${type.value[el].required ? '*' : ''}: ${getPropTypeHtml(type.value[el])}</li>`,
                        '',
                    )}
                </ul>
            `;
        }

        if (Array.isArray(type.value)) {
            return `
                <ul>
                    ${type.value.reduce(
                        (acc, el) => `${acc}<li>${el.name || el.value}</li>`,
                        '',
                    )}
                </ul>
            `;
        }

        return `<ul><li>${getPropTypeHtml(type.value)}</li><ul>`;
    }

    return `${type.name}${getValue(type)}`;
}
