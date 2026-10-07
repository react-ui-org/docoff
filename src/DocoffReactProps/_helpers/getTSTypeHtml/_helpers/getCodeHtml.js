import { escapeHtml } from '../../escapeHtml';

/**
 * Types are presented as code, the same way as the default values are.
 *
 * @param {string} text The type as a text
 * @returns {string} The HTML code
 */
export const getCodeHtml = (text) => `<code>${escapeHtml(text)}</code>`;
