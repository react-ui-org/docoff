/**
 * @returns {string|undefined} The path the site is deployed at, defined by `window.docoffConfig.basePath`. URLs
 *   starting with a slash are resolved against it.
 */
export const getBasePath = () => window.docoffConfig?.basePath;
