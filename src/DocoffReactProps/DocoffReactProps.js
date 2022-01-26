import * as docgen from 'react-docgen';
import md from 'markdown-it';

class DocoffReactProps extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const componentUrls = this.dataset.src.split('|');
        const componentInfos = await Promise.all(componentUrls.map(async (componentUrl) => {
            const componentRes = await fetch(componentUrl);
            let componentSrc = await componentRes.text();

            // If the file suffix is `*.js` we assume it is not a component, but merely a props definition file.
            // Since react-docgen can only parse components, we create a fake component
            // For this to work the file must declare a `props` holding the props Object.
            // TODO: write custom react-docgen resolver/handler
            if (componentUrl.endsWith('.js')) {
                componentSrc = `
                    import React from 'react';
                    ${componentSrc}
                    export const Component = () => (<span />);
                    Component.propTypes = props;
                `
            }

            return docgen.parse(componentSrc, docgen.resolver.findAllExportedComponentDefinitions, null, {
                babelrc: false,
                babelrcRoots: false,
                filename: 'playground.js',
                configFile: false,
                parserOptions: {
                    plugins: [
                        'jsx',
                        'asyncGenerators',
                        'bigInt',
                        'classProperties',
                        'classPrivateProperties',
                        'classPrivateMethods',
                        ['decorators', { decoratorsBeforeExport: false }],
                        'doExpressions',
                        'dynamicImport',
                        'exportDefaultFrom',
                        'exportNamespaceFrom',
                        'functionBind',
                        'functionSent',
                        'importMeta',
                        'logicalAssignment',
                        'nullishCoalescingOperator',
                        'numericSeparator',
                        'objectRestSpread',
                        'optionalCatchBinding',
                        'optionalChaining',
                        ['pipelineOperator', { proposal: 'minimal' }],
                        'throwExpressions',
                        'topLevelAwait',
                    ]
                }
            });
        }));

        const props = componentInfos.reduce(
            (acc, info) => ({
                ...acc,
                // TODO: ensure how this behaves with different export types (named, export, export+named, etc…)
                // This works for my use cases, but it is not a robust solution
                ...info[0].props,
            }),
            {},
        );

        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
            </tr>
        `;

        // TODO: The table rendering logic shoul be moved to custom file and tested
        const renderType = (type) => {
            const getValue = () => {
                if (!type.value) {
                    return '';
                }

                if (type.name === 'shape') {
                    return `
                        <ul>
                            ${Object.keys(type.value).reduce(
                                (acc, el) => `${acc}<li>${el}${type.value[el].required ? '*' : ''}: ${renderType(type.value[el])}</li>`,
                                '',
                            )}
                        </ul>
                    `
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

                return `<ul><li>${renderType(type.value)}</li><ul>`;
            }

            return `${type.name}${getValue(type)}`;
        }

        Object.keys(props).forEach((propName) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th>${propName}${props[propName].required ? '*' : ''}</th>
                <td>${renderType(props[propName].type)}</td>
                <td>${props[propName].defaultValue ? `<pre><code>${props[propName].defaultValue.value}</code></pre>` : ''}</td>
                <td>${md().render(props[propName].description)}</td>
            `;
            table.append(row);
        })
        this.append(table);
    };
}

export default DocoffReactProps;
