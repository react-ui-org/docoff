import { getModuleUrl } from './getModuleUrl';

const FILENAME = 'https://example.com/components/Button/Button.tsx';

describe('functionality', () => {
  it('resolves relative import against the file with the import', () => {
    expect(getModuleUrl('../../types', FILENAME, {})).toEqual('https://example.com/types');
  });

  it('looks up relative import in the file given for the file with the import', () => {
    expect(getModuleUrl('../../types', FILENAME, {}, { [FILENAME]: 'https://example.com/library.d.ts' }))
      .toEqual('https://example.com/library.d.ts');
  });

  it('resolves relative import of another file against it', () => {
    expect(getModuleUrl('./Button', 'https://example.com/components/Button/index.ts', {}, {
      [FILENAME]: 'https://example.com/library.d.ts',
    })).toEqual('https://example.com/components/Button/Button');
  });

  it('does not resolve import from package that is not listed', () => {
    expect(getModuleUrl('react', FILENAME, { '@scope/package': 'https://cdn.test/package' })).toBeNull();
  });

  it.each([
    ['folder', 'https://cdn.test/package', 'https://cdn.test/package/src/Button'],
    ['folder with trailing slash', 'https://cdn.test/package/', 'https://cdn.test/package/src/Button'],
    ['folder with file extension of another language', 'https://cdn.test/package.js', 'https://cdn.test/package.js/src/Button'],
    ['file', 'https://cdn.test/package.d.ts', 'https://cdn.test/package.d.ts'],
    ['file with query string', 'https://cdn.test/package.d.ts?v=1', 'https://cdn.test/package.d.ts?v=1'],
  ])('resolves import from package placed in a %s', (placement, packageUrl, expectedUrl) => {
    expect(getModuleUrl('@scope/package/src/Button', FILENAME, { '@scope/package': packageUrl })).toEqual(expectedUrl);
  });

  it('resolves import from the package with the longest matching name', () => {
    expect(getModuleUrl('@scope/package/icons/Icon', FILENAME, {
      '@scope/package': 'https://cdn.test/package',
      '@scope/package/icons': 'https://cdn.test/icons',
    })).toEqual('https://cdn.test/icons/Icon');
  });
});
