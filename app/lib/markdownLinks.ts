import { withBasePath } from '../services/sitePath';

const markdownOrigin = 'https://documentdb.invalid';

const docsRoot = '/docs/';

// content.config.json publishes the docs repository's api-reference/ folder at
// /docs/reference. Authors write links against the source layout they can see,
// so a cross-section link naming api-reference has to be mapped onto the
// section the site actually serves. Every other mapping keeps its folder name.
const publishedSectionBySourceFolder: Record<string, string> = {
  'api-reference': 'reference',
};

function applySectionMapping(pathname: string): string {
  if (!pathname.startsWith(docsRoot)) {
    return pathname;
  }

  const rest = pathname.slice(docsRoot.length);
  const separatorIndex = rest.indexOf('/');
  const section = separatorIndex === -1 ? rest : rest.slice(0, separatorIndex);
  const published = publishedSectionBySourceFolder[section];

  if (!published) {
    return pathname;
  }

  const remainder = separatorIndex === -1 ? '' : rest.slice(separatorIndex);
  return `${docsRoot}${published}${remainder}`;
}

export function resolveMarkdownLink(
  href: string | undefined,
  sourcePath: string,
): string | undefined {
  if (!href) {
    return href;
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('//')) {
    return href;
  }

  const hrefPath = href.split(/[?#]/, 1)[0];
  if (!hrefPath.toLowerCase().endsWith('.md')) {
    return href;
  }

  const normalizedSourcePath = sourcePath.startsWith('/')
    ? sourcePath
    : `/${sourcePath}`;
  // URL applies the same dot-segment rules as a browser without coupling the
  // result to the page URL that happens to render this source file.
  const target = new URL(href, new URL(normalizedSourcePath, markdownOrigin));

  if (target.pathname.toLowerCase().endsWith('/index.md')) {
    target.pathname = target.pathname.slice(0, -'index.md'.length);
  } else {
    target.pathname = `${target.pathname.slice(0, -'.md'.length)}/`;
  }

  const publishedPathname = applySectionMapping(target.pathname);

  // Rendered as a plain anchor rather than next/link, so the base path is not
  // applied for us - a subpath deployment needs it added here.
  return `${withBasePath(publishedPathname)}${target.search}${target.hash}`;
}
