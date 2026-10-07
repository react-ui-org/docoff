import { getRowElement } from './_helpers/getRowElement';

/**
 * @param {Object[]} properties The props, each with its name as `key`, its evaluated type as `value` and its
 *   `description`
 * @param {Object} defaultValues The default values of the props by the names of the props
 * @returns {HTMLElement} The table of props
 */
export const getTableElement = (properties, defaultValues) => {
  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
        <th>Prop</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
  `;
  table.append(...properties.map((property) => getRowElement(property, defaultValues[property.key])));

  return table;
};
