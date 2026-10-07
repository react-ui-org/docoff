/**
 * @param {string} message The message to present instead of the table, e.g. an error
 * @returns {HTMLElement} The element with the message
 */
export const getMessageElement = (message) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;

  return messageElement;
};
