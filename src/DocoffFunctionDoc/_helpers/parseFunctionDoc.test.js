import { parseFunctionDoc } from './parseFunctionDoc';

describe('parseFunctionDoc', () => {
  it('should parse function with JSDoc comments', () => {
    const code = `
/**
 * Adds two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} The sum
 */
function add(a, b) {
  return a + b;
}
    `;

    const result = parseFunctionDoc(code);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('add');
    expect(result[0].description).toBe('Adds two numbers');
    expect(result[0].params).toHaveLength(2);
    expect(result[0].params[0].name).toBe('a');
    expect(result[0].params[0].type).toBe('number');
    expect(result[0].params[0].description).toBe('First number');
    expect(result[0].returns.type).toBe('number');
    expect(result[0].returns.description).toBe('The sum');
  });

  it('should parse arrow function in variable declaration', () => {
    const code = `
/**
 * Multiplies two numbers
 * @param {number} x - First number
 * @param {number} y - Second number
 * @returns {number} The product
 */
const multiply = (x, y) => x * y;
    `;

    const result = parseFunctionDoc(code);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('multiply');
    expect(result[0].description).toBe('Multiplies two numbers');
    expect(result[0].params).toHaveLength(2);
    expect(result[0].returns.type).toBe('number');
  });

  it('should handle optional parameters', () => {
    const code = `
/**
 * Greets a person
 * @param {string} name - The person's name
 * @param {string} [title] - Optional title
 * @returns {string} Greeting message
 */
function greet(name, title) {
  return title ? \`Hello \${title} \${name}\` : \`Hello \${name}\`;
}
    `;

    const result = parseFunctionDoc(code);

    expect(result).toHaveLength(1);
    expect(result[0].params).toHaveLength(2);
    expect(result[0].params[1].optional).toBe(true);
  });

  it('should return empty array for code without JSDoc', () => {
    const code = `
function noDoc() {
  return 'no documentation';
}
    `;

    const result = parseFunctionDoc(code);

    expect(result).toHaveLength(0);
  });

  it('should handle invalid code gracefully', () => {
    const code = 'invalid javascript code {{{';

    const result = parseFunctionDoc(code);

    expect(result).toHaveLength(0);
  });
});
