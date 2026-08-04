import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveMarkdownLink } from '../app/lib/markdownLinks';

describe('resolveMarkdownLink', () => {
  it('maps a sibling Markdown file to its published article route', () => {
    expect(
      resolveMarkdownLink(
        'functions.md',
        '/docs/postgres-api/index.md',
      ),
    ).toBe('/docs/postgres-api/functions/');
  });

  it('resolves encoded operator filenames from the source directory', () => {
    expect(
      resolveMarkdownLink(
        './%24bucket.md',
        '/docs/reference/operators/aggregation/%24bucketauto.md',
      ),
    ).toBe('/docs/reference/operators/aggregation/%24bucket/');
  });

  it('normalizes parent-directory references before publishing the route', () => {
    expect(
      resolveMarkdownLink(
        '../aggregation/aggregate.md',
        '/docs/reference/commands/query-and-write/getMore.md',
      ),
    ).toBe('/docs/reference/commands/aggregation/aggregate/');
  });

  it('collapses index files to their directory route', () => {
    expect(
      resolveMarkdownLink(
        '../index.md#quick-start',
        '/docs/getting-started/guides/python.md',
      ),
    ).toBe('/docs/getting-started/#quick-start');
  });

  it('preserves query strings and fragments', () => {
    expect(
      resolveMarkdownLink(
        'python-setup.md?view=full#connect',
        '/docs/getting-started/index.md',
      ),
    ).toBe('/docs/getting-started/python-setup/?view=full#connect');
  });

  it.each([
    'https://example.com/readme.md',
    '//example.com/readme.md',
    '/docs/reference/',
    '#examples',
    'mailto:guide.md',
  ])('leaves non-source-document link %s unchanged', (href) => {
    expect(
      resolveMarkdownLink(href, '/docs/getting-started/index.md'),
    ).toBe(href);
  });

  // content.config.json maps the docs repository's api-reference/ folder onto
  // /docs/reference. Authors link against the folder they can see, so without
  // the mapping a cross-section link resolves to a route that does not exist.
  it('maps the api-reference source folder onto the published reference section', () => {
    expect(
      resolveMarkdownLink(
        '../api-reference/operators/aggregation/%24limit.md',
        '/docs/getting-started/index.md',
      ),
    ).toBe('/docs/reference/operators/aggregation/%24limit/');
  });

  it('maps api-reference when the link climbs out of the reference section itself', () => {
    expect(
      resolveMarkdownLink(
        '../../../api-reference/commands/query-and-write/find.md',
        '/docs/reference/operators/aggregation/%24search.md',
      ),
    ).toBe('/docs/reference/commands/query-and-write/find/');
  });

  it('leaves sections that publish under their own folder name alone', () => {
    expect(
      resolveMarkdownLink(
        '../postgres-api/functions.md',
        '/docs/getting-started/index.md',
      ),
    ).toBe('/docs/postgres-api/functions/');
  });
});

describe('resolveMarkdownLink with a configured base path', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  // sitePath reads NEXT_BASE_PATH once at module scope, so the module has to be
  // re-imported after the environment is stubbed.
  async function importWithBasePath(basePath: string) {
    vi.resetModules();
    vi.stubEnv('NEXT_BASE_PATH', basePath);
    return (await import('../app/lib/markdownLinks')).resolveMarkdownLink;
  }

  it('prefixes the resolved route, since the anchor is not a next/link', async () => {
    const resolve = await importWithBasePath('/preview');

    expect(resolve('functions.md', '/docs/postgres-api/index.md')).toBe(
      '/preview/docs/postgres-api/functions/',
    );
  });

  it('prefixes a mapped cross-section route as well', async () => {
    const resolve = await importWithBasePath('/preview');

    expect(
      resolve(
        '../api-reference/operators/aggregation/%24limit.md',
        '/docs/getting-started/index.md',
      ),
    ).toBe('/preview/docs/reference/operators/aggregation/%24limit/');
  });

  it('keeps the query and fragment after the prefixed path', async () => {
    const resolve = await importWithBasePath('preview');

    expect(
      resolve('python-setup.md?view=full#connect', '/docs/getting-started/index.md'),
    ).toBe('/preview/docs/getting-started/python-setup/?view=full#connect');
  });

  it('leaves links it does not rewrite untouched', async () => {
    const resolve = await importWithBasePath('/preview');

    expect(resolve('#examples', '/docs/getting-started/index.md')).toBe('#examples');
    expect(
      resolve('https://example.com/readme.md', '/docs/getting-started/index.md'),
    ).toBe('https://example.com/readme.md');
  });
});
