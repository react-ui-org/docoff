import md from 'markdown-it';
import * as docgen from 'react-docgen';
import { basePropTypesReducer } from './basePropTypesReducer';
import { derivedPropTypesReducer } from './derivedPropTypesReducer';
import { getFakeComponentSrc } from './getFakeComponentSrc';
import { getPropTypeHtml } from './getPropTypeHtml';
import { getTableElement } from './getTableElement';
import { getTSTypeHtml } from './getTSTypeHtml';

const PROP_DEF_COMPONENT = 'DocoffReactPropDefComponent';

export const getPropsTable = async (componentUrls) => {
  // Download the component source files and extract the information about the components
  const componentInfos = await Promise.all(componentUrls.map(async (componentUrl) => {
    const componentRes = await fetch(componentUrl);
    if (componentRes.status !== 200) {
      return undefined;
    }

    if (componentUrl.endsWith('.props.json')) {
      const json = await componentRes.json();
      return json['public/exampleTS/Greeting.tsx'];
    }

    const componentRawSrc = await componentRes.text();
    const componentSrc = componentUrl.endsWith('.props.js')
      ? getFakeComponentSrc(componentRawSrc, PROP_DEF_COMPONENT)
      : componentRawSrc;

    return docgen.parse(
      componentSrc,
      {
        babelOptions: {
          parserOpts: {
            plugins: ['typescript', 'jsx'],
          },
        },
        resolver: new docgen.builtinResolvers.FindAllDefinitionsResolver(),
      },
    );
  }));

  if (componentInfos.includes(undefined)) {
    const errMessage = document.createElement('div');
    errMessage.innerText = 'Resources could not be downloaded.';
    return errMessage;
  }

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

  const table = getTableElement();
  Object.keys(propTypes)
    .sort()
    .forEach((propName) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <th>${propName}${propTypes[propName].required ? '*' : ''}</th>
          <td>
            ${propTypes[propName]?.type ? getPropTypeHtml(propTypes[propName]?.type) : getTSTypeHtml(propTypes[propName]?.tsType)}
          </td>
          <td>${propTypes[propName].defaultValue ? `<pre><code>${propTypes[propName].defaultValue.value}</code></pre>` : ''}</td>
          <td>${md().render(propTypes[propName].description)}</td>
        `;
      table.append(row);
    });

  return table;
};
