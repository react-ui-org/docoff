import { resolveUrl } from './resolveUrl';

const PAGE_URL = 'https://example.com/docs/components/button/';

describe('functionality', () => {
  it.each([
    ['/components/Button/Button.tsx', undefined, 'https://example.com/components/Button/Button.tsx'],
    ['/components/Button/Button.tsx', '/docs/', 'https://example.com/docs/components/Button/Button.tsx'],
    ['/components/Button/Button.tsx', '/docs', 'https://example.com/docs/components/Button/Button.tsx'],
    ['/components/Button/Button.tsx', 'https://cdn.test/v1/', 'https://cdn.test/v1/components/Button/Button.tsx'],
    ['Button.tsx', '/docs/', 'https://example.com/docs/components/button/Button.tsx'],
    ['../Button.tsx', undefined, 'https://example.com/docs/components/Button.tsx'],
    ['https://cdn.test/Button.tsx', '/docs/', 'https://cdn.test/Button.tsx'],
    ['//cdn.test/Button.tsx', '/docs/', 'https://cdn.test/Button.tsx'],
  ])('resolves `%s` with base path `%s`', (url, basePath, expectedUrl) => {
    expect(resolveUrl(PAGE_URL, basePath, url)).toEqual(expectedUrl);
  });
});
