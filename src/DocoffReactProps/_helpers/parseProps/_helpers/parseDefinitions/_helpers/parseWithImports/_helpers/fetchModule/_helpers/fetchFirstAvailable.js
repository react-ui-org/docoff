/**
 * @param {string[]} urls The URLs to try, sorted by priority
 * @returns {Promise<{ code: string, url: string }|null>} The content of the first available file and its URL,
 *   `null` when no file is available
 */
export const fetchFirstAvailable = async ([url, ...remainingUrls]) => {
  if (url === undefined) {
    return null;
  }

  const response = await fetch(url).catch(() => null);

  // Some servers respond to requests for missing files with an HTML page and status 200
  if (response?.status === 200 && !response.headers.get('content-type')?.startsWith('text/html')) {
    return {
      code: await response.text(),
      url,
    };
  }

  return fetchFirstAvailable(remainingUrls);
};
