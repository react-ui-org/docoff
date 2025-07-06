/**
 * Calculates the sum of two numbers
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The sum of a and b
 */
export function add(a, b) {
  return a + b;
}

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

/**
 * Fetches user data from an API
 * @param {string} userId - The ID of the user to fetch
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.includeProfile=true] - Whether to include profile data
 * @param {number} [options.timeout=5000] - Request timeout in milliseconds
 * @returns {Promise<Object>} Promise that resolves to user data
 */
export async function fetchUser(userId, options = {}) {
  const {
    includeProfile = true,
    timeout = 5000,
  } = options;

  // Implementation would go here - using timeout to avoid linting error
  return {
    id: userId,
    name: 'John Doe',
    profile: includeProfile ? {} : null,
    requestTimeout: timeout,
  };
}
