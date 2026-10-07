import { parseDefinitions } from './parseDefinitions';

const TYPE_COMPONENT_NAME = 'DocoffReactPropsType';
const TYPE_COMPONENT_FILE_NAME = 'docoff-react-props-type.tsx';
const TYPE_NAME = 'DocoffReactPropsTypeProps';

/**
 * `react-docgen` only describes types of props of components. Therefore, a component whose props are of the
 * given type is made up. It imports the type the same way any other file would, so the type must be exported.
 * The type is imported under another name, so that a type exported as `default` can be imported too.
 *
 * @param {string} url The absolute URL of the file
 * @param {string} name The name of the type exported from the file, or `default`
 * @param {Object} resolvePackages The URLs of the packages to resolve by the names of the packages
 * @param {Map} modules The files that have already been downloaded by their URL, including the file itself
 * @returns {Promise<Object>} The made-up component as described by `react-docgen`
 */
export const findType = async (url, name, resolvePackages, modules) => {
  const typeComponentSource = `
    import type { ${name} as ${TYPE_NAME} } from './${url.split('/').pop()}';

    export const ${TYPE_COMPONENT_NAME} = (props: ${TYPE_NAME}) => <div />;
  `;
  // The downloaded files are parsed again, as their parsed form is bound to the source code it was parsed for
  const downloadedModules = new Map([...modules].map(([moduleUrl, module]) => [
    moduleUrl,
    module && {
      code: module.code,
      url: module.url,
    },
  ]));
  const [definition] = await parseDefinitions(
    typeComponentSource,
    new URL(TYPE_COMPONENT_FILE_NAME, url).href,
    resolvePackages,
    downloadedModules,
  );

  return definition;
};
