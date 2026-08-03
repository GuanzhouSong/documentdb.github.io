const markdownOrigin = 'https://documentdb.invalid';

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

  return `${target.pathname}${target.search}${target.hash}`;
}
