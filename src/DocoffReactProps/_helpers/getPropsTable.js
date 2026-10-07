import { getBasePath } from '../../_helpers/getBasePath';
import { resolveUrl } from '../../_helpers/resolveUrl';
import { evaluateTSType } from './evaluateTSType';
import { getConfig } from './getConfig';
import { getMessageElement } from './getMessageElement';
import { getPackageUrls } from './getPackageUrls';
import { getTableElement } from './getTableElement';
import { getTypeProperties } from './getTypeProperties';
import { parseProps } from './parseProps';

const NAME_REGEX = /^[A-Za-z_$][\w$]*$/;
const TYPESCRIPT_URL_REGEX = /\.tsx?$/;

/**
 * Creates the table of props of the component, or of the type, exported from the file under the given name.
 *
 * @param {string|null} src The URL of the TypeScript file
 * @param {string|null} name The name of the component or of the type
 * @returns {Promise<HTMLElement>} The table, or a message when the table cannot be created
 */
export const getPropsTable = async (src, name) => {
  if (!src || !name || !NAME_REGEX.test(name)) {
    return getMessageElement('Attributes `src` and `name` are required.');
  }

  const basePath = getBasePath();
  const config = getConfig();
  const url = resolveUrl(document.baseURI, basePath, src);
  if (!TYPESCRIPT_URL_REGEX.test(new URL(url).pathname)) {
    return getMessageElement('Only TypeScript files are supported.');
  }

  const response = await fetch(url).catch(() => null);
  if (response?.status !== 200) {
    return getMessageElement('Resources could not be downloaded.');
  }

  try {
    const packageUrls = getPackageUrls(document.baseURI, basePath, config.resolvePackages);
    const props = await parseProps(await response.text(), url, name, packageUrls);
    const properties = getTypeProperties(props.types.map((tsType) => evaluateTSType(tsType, config)));

    return properties.length > 0
      ? getTableElement(properties, props.defaultValues)
      : getMessageElement(`No props of \`${name}\` were found.`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return getMessageElement(`Props of \`${name}\` could not be read: ${error.message}`);
  }
};
