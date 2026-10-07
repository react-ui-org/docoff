import { getCandidateUrls } from './getCandidateUrls';

describe('functionality', () => {
  it('tries files before directories with an index file', () => {
    expect(getCandidateUrls('https://example.com/components/Button')).toEqual([
      'https://example.com/components/Button.ts',
      'https://example.com/components/Button.tsx',
      'https://example.com/components/Button/index.ts',
      'https://example.com/components/Button/index.tsx',
    ]);
  });

  it.each([
    'https://example.com/components/Button.types.ts',
    'https://example.com/library.d.ts?v=1',
    'https://example.com/library.d.ts#types',
  ])('keeps URL with file extension: %s', (url) => {
    expect(getCandidateUrls(url)).toEqual([url]);
  });
});
