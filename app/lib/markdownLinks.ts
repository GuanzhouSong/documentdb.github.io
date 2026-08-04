// Deliberately free of any base-path handling. This module is reachable from a
// client component, and NEXT_BASE_PATH is not NEXT_PUBLIC_-prefixed, so its
// value is stripped from the browser bundle: reading it here would produce a
// prefixed href during the static render and an unprefixed one after
// hydration. The route returned below is base-path-relative, and the caller
// renders it with next/link, which applies the basePath configured in
// next.config on both the server and the client.
const markdownOrigin = 'https://documentdb.invalid';

const docsRoot = '/docs/';

// content.config.json publishes the docs repository's api-reference/ folder at
// /docs/reference. Authors write links against the source layout they can see,
// so a cross-section link naming api-reference has to be mapped onto the
// section the site actually serves. Every other mapping keeps its folder name.
//
// A Map rather than an object literal: an object would also resolve inherited
// keys, so a link naming constructor, toString or __proto__ would be treated as
// a configured mapping and interpolated into the route.
const publishedSectionBySourceFolder = new Map([['api-reference', 'reference']]);

function applySectionMapping(pathname: string): string {
  if (!pathname.startsWith(docsRoot)) {
    return pathname;
  }

  const rest = pathname.slice(docsRoot.length);
  const separatorIndex = rest.indexOf('/');
  const section = separatorIndex === -1 ? rest : rest.slice(0, separatorIndex);
  const published = publishedSectionBySourceFolder.get(section);

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

  return `${publishedPathname}${target.search}${target.hash}`;
}
