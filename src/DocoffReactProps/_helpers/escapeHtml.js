/**
 * @param {string} text The text
 * @returns {string} The text that can be safely used as content of an HTML element
 */
export const escapeHtml = (text) => text
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;');
