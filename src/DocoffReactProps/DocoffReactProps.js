import * as docgen from 'react-docgen';
import md from 'markdown-it';
import { basePropTypesReducer } from './_helpers/basePropTypesReducer';
import { derivedPropTypesReducer } from './_helpers/derivedPropTypesReducer';
import { getPropTypeHtml } from './_helpers/getPropTypeHtml';
import { docgenParseOptions } from './docgenParseOptions';

class DocoffReactProps extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        // Parse the component URLs
        const componentUrls = this.dataset.src
            .split('|')
            .map((url) => url.trim());

        // Download the component source files and extract the information about the components
        const componentInfos = await Promise.all(componentUrls.map(async (componentUrl) => {
            const componentRes = await fetch(componentUrl);
            let componentSrc = await componentRes.text();

            // If the file suffix is `*.propsTypes.js` we know it prop definition file.
            // Since react-docgen can only parse components, we create a fake component.
            // For this to work the file must declare:
            //  * `propTypes` holding the props Object
            //  * optionally `defaultProps` holding their respective default values
            if (componentUrl.endsWith('.props.js')) {
                componentSrc = `
                    import React from 'react';
                    ${componentSrc}
                    export const DocoffReactFakeComponent = () => (<span />);
                    DocoffReactFakeComponent.propTypes = propTypes;
                    DocoffReactFakeComponent.defaultProps = defaultProps;
                `
            }

            return docgen.parse(
                componentSrc,
                docgen.resolver.findAllExportedComponentDefinitions,
                null,
                docgenParseOptions
            );
        }));

        // Merge the propType definitions
        const propTypes = componentInfos.reduce(
            (acc, info) => {
                const derivedPropTypes = info[0].props;
                const derivedPropNames = Object.keys(derivedPropTypes);

                // We do not filter base component props if the base component is in fact a prop definition file
                const basePropTypes = info[0].displayName === 'DocoffReactFakeComponent'
                    ? acc
                    : { ...(Object.keys(acc).reduce(basePropTypesReducer(acc, derivedPropNames), {})) };

                return {
                    ...basePropTypes,
                    ...(derivedPropNames.reduce(derivedPropTypesReducer(acc, derivedPropTypes), {})),
                }
            },
            {},
        );

        // Render the output
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
            </tr>
        `;

        Object.keys(propTypes).forEach((propName) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th>${propName}${propTypes[propName].required ? '*' : ''}</th>
                <td>${getPropTypeHtml(propTypes[propName].type)}</td>
                <td>${propTypes[propName].defaultValue ? `<pre><code>${propTypes[propName].defaultValue.value}</code></pre>` : ''}</td>
                <td>${md().render(propTypes[propName].description)}</td>
            `;
            table.append(row);
        })
        this.append(table);
    };
}

export default DocoffReactProps;
