/**
 * Resolves the URL to an absolute one. It ensures that URLs starting with a slash are resolved against the path
 * the site is deployed at, not against the root of the domain.
 *
 * @param {string} pageUrl The URL of the current page
 * @param {string|undefined} basePath The path the site is deployed at, e.g. `/docs/`
 * @param {string} url The URL as it is written, e.g. `/components/Button/Button.tsx` or `/main.css`
 * @returns {string} The absolute URL
 */
export const resolveUrl = (pageUrl, basePath, url) => {
  if (!basePath || !url.startsWith('/') || url.startsWith('//')) {
    return new URL(url, pageUrl).href;
  }

  return new URL(url.slice(1), new URL(basePath.endsWith('/') ? basePath : `${basePath}/`, pageUrl)).href;
};
