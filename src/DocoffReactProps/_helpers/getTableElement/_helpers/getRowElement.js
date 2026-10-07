import md from 'markdown-it';
import { escapeHtml } from '../../escapeHtml';
import { getTSTypeHtml } from '../../getTSTypeHtml';

/**
 * @param {Object} property The prop: its name as `key`, its evaluated type as `value` and its `description`
 * @param {string|undefined} defaultValue The default value of the prop
 * @returns {HTMLElement} The row of the table
 */
export const getRowElement = (property, defaultValue) => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <th>${escapeHtml(property.key)}${property.value.required ? '*' : ''}</th>
    <td>${getTSTypeHtml(property.value)}</td>
    <td>${defaultValue ? `<pre><code>${escapeHtml(defaultValue)}</code></pre>` : ''}</td>
    <td>${md().render(property.description ?? '')}</td>
  `;

  return row;
};
