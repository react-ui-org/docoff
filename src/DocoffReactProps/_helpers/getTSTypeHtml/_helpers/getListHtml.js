/**
 * @param {string} label What the items are a part of, e.g. `Union`
 * @param {string[]} items The HTML codes of the items
 * @returns {string} The HTML code of the labelled list
 */
export const getListHtml = (label, items) => `${label}: <ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
