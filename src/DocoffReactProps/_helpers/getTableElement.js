export const getTableElement = () => {
  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
        <th>Prop</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
  `;

  return table;
};
