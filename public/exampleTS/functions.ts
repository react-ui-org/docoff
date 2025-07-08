/**
 * Formats a user's full name with proper capitalization
 * @param firstName - The user's first name
 * @param lastName - The user's last name
 * @param includeTitle - Whether to include a title prefix
 * @returns The formatted full name
 */
export function formatName(firstName: string, lastName: string, includeTitle: boolean = false): string {
  const fullName = `${firstName} ${lastName}`;
  return includeTitle ? `Mr./Ms. ${fullName}` : fullName;
}