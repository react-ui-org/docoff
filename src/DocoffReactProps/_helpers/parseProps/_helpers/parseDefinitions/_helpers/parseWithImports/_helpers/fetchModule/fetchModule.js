import { fetchFirstAvailable } from './_helpers/fetchFirstAvailable';
import { getCandidateUrls } from './_helpers/getCandidateUrls';

/**
 * Downloads the file an import points to.
 *
 * @param {string} moduleUrl The URL of the import, typically without file extension
 * @returns {Promise<{ code: string, url: string }|null>} The source code of the file and its URL, `null` when no
 *   file is available
 */
export const fetchModule = (moduleUrl) => fetchFirstAvailable(getCandidateUrls(moduleUrl));
