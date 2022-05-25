import * as docgen from 'react-docgen';
import md from 'markdown-it';
import { basePropTypesReducer } from './_helpers/basePropTypesReducer';
import { derivedPropTypesReducer } from './_helpers/derivedPropTypesReducer';
import { getFakeComponentSrc } from './_helpers/getFakeComponentSrc';
import { getPropTypeHtml } from './_helpers/getPropTypeHtml';
import { getTableElement } from './_helpers/getTableElement';
import { docgenParseOptions } from './docgenParseOptions';

const PROP_DEF_COMPONENT = 'DocoffReactPropDefComponent';

class DocoffReactProps extends HTMLElement {
  async connectedCallback() {
    // Parse the component URLs
    const componentUrls = this.dataset.src
      .split('|')
      .map((url) => url.trim());

    // Download the component source files and extract the information about the components
    const componentInfos = await Promise.all(componentUrls.map(async (componentUrl) => {
      const componentRes = await fetch(componentUrl);
      if (componentRes.status !== 200) {
        throw new Error(`Resource '${componentUrl}' could not be downloaded. HTTP Status Code: ${componentRes.status}`);
      }
      const componentRawSrc = await componentRes.text();
      const componentSrc = componentUrl.endsWith('.props.js')
        ? getFakeComponentSrc(componentRawSrc, PROP_DEF_COMPONENT)
        : componentRawSrc;

      return docgen.parse(
        componentSrc,
        docgen.resolver.findAllExportedComponentDefinitions,
        null,
        docgenParseOptions,
      );
    }));

    // Merge the propType definitions
    const propTypes = componentInfos.reduce(
      (acc, info) => {
        const derivedPropTypes = info[0].props;
        const derivedPropNames = Object.keys(derivedPropTypes);

        return {
          // Remove props not used in derived
          ...(Object.keys(acc).reduce(
            basePropTypesReducer(acc, derivedPropNames),
            {},
          )),
          // Add props from derived
          ...(derivedPropNames.reduce(
            derivedPropTypesReducer(acc, derivedPropTypes),
            {},
          )),
        };
      },
      {},
    );

    // Render the output
    const table = getTableElement();
    Object.keys(propTypes).forEach((propName) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <th>${propName}${propTypes[propName].required ? '*' : ''}</th>
        <td>${getPropTypeHtml(propTypes[propName].type)}</td>
        <td>${propTypes[propName].defaultValue ? `<pre><code>${propTypes[propName].defaultValue.value}</code></pre>` : ''}</td>
        <td>${md().render(propTypes[propName].description)}</td>
      `;
      table.append(row);
    });
    this.append(table);
  }
}

export default DocoffReactProps;
