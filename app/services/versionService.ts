import fs from 'fs';
import path from 'path';
import { load as loadYaml } from 'js-yaml';
import matter from 'gray-matter';
import { Link } from '../types/Link';

/**
 * Serves frozen documentation snapshots compiled by scripts/compile-content.tsx
 * into versioned/<label>/. The main (rolling) documentation is served by
 * articleService.ts from articles/; this module only handles archived versions
 * rendered under /docs/v/<label>/.
 *
 * Versioned pages render the snapshot content as-is: the editorial overrides
 * that articleService applies to current pages deliberately do not apply here,
 * because a snapshot must show the docs exactly as they were at the tag.
 */

const versionedDirectory = path.join(process.cwd(), 'versioned');

/** Labels of all compiled documentation versions, newest first. */
export function getDocVersions(): string[] {
  if (!fs.existsSync(versionedDirectory)) {
    return [];
  }

  return fs
    .readdirSync(versionedDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort()
    .reverse();
}

function versionArticlesDir(version: string): string {
  return path.join(versionedDirectory, version, 'articles');
}

/** Article sections available in a given version snapshot. */
export function getVersionedSections(version: string): string[] {
  const base = versionArticlesDir(version);

  if (!fs.existsSync(base)) {
    return [];
  }

  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

/** Whether a specific article exists in a version snapshot. */
export function versionedArticleExists(version: string, section: string, file: string): boolean {
  return fs.existsSync(path.join(versionArticlesDir(version), section, `${file}.md`));
}

/** All {version, section, slug} combinations, for generateStaticParams. */
export function getAllVersionedArticlePaths(): { version: string; section: string; slug: string[] }[] {
  const paths: { version: string; section: string; slug: string[] }[] = [];

  for (const version of getDocVersions()) {
    for (const section of getVersionedSections(version)) {
      const sectionPath = path.join(versionArticlesDir(version), section);
      const files = fs
        .readdirSync(sectionPath, { withFileTypes: true })
        .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.md'))
        .map((dirent) => dirent.name.replace('.md', ''));

      for (const file of files) {
        paths.push({ version, section, slug: file === 'index' ? [] : [file] });
      }
    }
  }

  return paths;
}

/** Sidebar navigation for a versioned section, with links under /docs/v/<version>/. */
export function getVersionedNavigation(version: string, section: string): Link[] {
  const navPath = path.join(versionArticlesDir(version), section, 'navigation.yml');

  if (!fs.existsSync(navPath)) {
    return [];
  }

  const rawLinks = loadYaml(fs.readFileSync(navPath, 'utf8')) as Link[];

  return rawLinks.map((link) => {
    let transformedLink = link.link;

    if (transformedLink.endsWith('.md')) {
      const file = transformedLink.replace('.md', '');
      transformedLink =
        file === 'index'
          ? `/docs/v/${version}/${section}`
          : `/docs/v/${version}/${section}/${file}`;
    }

    return { ...link, link: transformedLink, children: undefined };
  });
}

/** Load a versioned article: raw snapshot content plus parsed front matter. */
export function getVersionedArticleByPath(
  version: string,
  section: string,
  slug: string[] = []
): {
  content: string;
  frontmatter: { title?: string; [key: string]: any };
  navigation: Link[];
  version: string;
  section: string;
  file: string;
} | null {
  const file = slug.length > 0 ? slug[slug.length - 1] : 'index';
  const markdownPath = path.join(versionArticlesDir(version), section, `${file}.md`);

  if (!fs.existsSync(markdownPath)) {
    return null;
  }

  const { data: frontmatter, content } = matter(fs.readFileSync(markdownPath, 'utf8'));

  return {
    content,
    frontmatter,
    navigation: getVersionedNavigation(version, section),
    version,
    section,
    file,
  };
}
