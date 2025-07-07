/**
 * Formats a user's full name
 * @param {string} firstName - The user's first name
 * @param {string} lastName - The user's last name
 * @param {boolean} [includeTitle=false] - Whether to include a title
 * @returns {string} The formatted full name
 */
export function formatName(firstName, lastName, includeTitle = false) {
  const fullName = `${firstName} ${lastName}`;
  return includeTitle ? `Mr./Ms. ${fullName}` : fullName;
}
