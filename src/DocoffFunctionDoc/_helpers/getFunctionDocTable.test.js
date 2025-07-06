import { getFunctionDocTable } from './getFunctionDocTable';

// Mock DOM globals with simplified implementation for testing
const mockDocument = {
  createElement: jest.fn().mockImplementation((tagName) => ({
    appendChild: jest.fn(),
    innerHTML: '',
    style: {},
    tagName: tagName.toUpperCase(),
    textContent: '',
  })),
};

// Mock fetch for testing
global.fetch = jest.fn();
global.document = mockDocument;

describe('getFunctionDocTable', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockDocument.createElement.mockClear();
  });

  it('should handle fetch success and create DOM elements', async () => {
    const mockCode = `
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

    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockCode),
    });

    const result = await getFunctionDocTable('/test.js');

    expect(result.tagName).toBe('DIV');
    expect(mockDocument.createElement).toHaveBeenCalledWith('div');
    expect(fetch).toHaveBeenCalledWith('/test.js');
  });

  it('should handle fetch errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const result = await getFunctionDocTable('/nonexistent.js');

    expect(result.tagName).toBe('DIV');
    expect(result.style.color).toBe('red');
  });

  it('should handle files with no documented functions', async () => {
    const mockCode = 'function undocumented() { return "no docs"; }';

    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockCode),
    });

    const result = await getFunctionDocTable('/test.js');

    expect(result.tagName).toBe('DIV');
  });
});
