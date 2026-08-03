import { describe, expect, it } from 'vitest';
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
});
