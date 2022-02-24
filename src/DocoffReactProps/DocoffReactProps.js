import * as docgen from 'react-docgen';
import md from 'markdown-it';
import { basePropTypesReducer } from './_helpers/basePropTypesReducer';
import { derivedPropTypesReducer } from './_helpers/derivedPropTypesReducer';
import { getFakeComponentSrc } from './_helpers/getFakeComponentSrc';
import { getPropTypeHtml } from './_helpers/getPropTypeHtml';
import { getTableElement } from './_helpers/getTableElement';
import { docgenParseOptions } from './docgenParseOptions';

const PROP_DEF_COMPONENT = 'DocoffReactPropDefComponent';
const WRAPPER_COMPONENT = 'DocoffReactWrapperComponent';

class DocoffReactProps extends HTMLElement {
  async connectedCallback() {
    // Parse the component URLs
    const componentUrls = this.dataset.src
      .split('|')
      .map((url) => url.trim());

    // Download the component source files and extract the information about the components
    const componentInfos = await Promise.all(componentUrls.map(async (componentUrl) => {
      const componentRes = await fetch(componentUrl);
      const componentSrc = await componentRes.text();

      const parseComponentSrc = (src) => docgen.parse(
        src,
        docgen.resolver.findAllExportedComponentDefinitions,
        null,
        docgenParseOptions,
      );

      if (componentUrl.endsWith('.props.js')) {
        // Parse prop definition file
        return parseComponentSrc(getFakeComponentSrc(componentSrc, PROP_DEF_COMPONENT));
      }
      try {
        // Parse `React.Component`
        return parseComponentSrc(componentSrc);
      } catch (e) {
        // Parse `React.Component` wrapper
        return parseComponentSrc(getFakeComponentSrc(componentSrc, WRAPPER_COMPONENT));
      }
    }));

    // Merge the propType definitions
    const propTypes = componentInfos.reduce(
      (acc, info) => {
        const derivedPropTypes = info[0].props;
        const derivedPropNames = Object.keys(derivedPropTypes);

        // We do not filter base component props if the base component is in fact a prop definition file
        const basePropTypes = info[0].displayName === PROP_DEF_COMPONENT
          ? acc
          : { ...(Object.keys(acc).reduce(basePropTypesReducer(acc, derivedPropNames), {})) };

        return {
          ...basePropTypes,
          ...(derivedPropNames.reduce(derivedPropTypesReducer(acc, derivedPropTypes), {})),
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
