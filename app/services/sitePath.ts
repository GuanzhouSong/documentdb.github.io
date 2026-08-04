// next.config republishes the normalized NEXT_BASE_PATH as
// NEXT_PUBLIC_BASE_PATH so this value survives into the browser bundle. Reading
// the private variable alone would make withBasePath silently wrong in a client
// component: prefixed during the static render, unprefixed after hydration, and
// identical in the exported HTML either way. The private variable stays as a
// fallback for server-only callers and standalone scripts, which never see the
// republished one.
const configuredBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH || process.env.NEXT_BASE_PATH;
const rawBasePath = configuredBasePath?.trim();
const normalizedBasePath = rawBasePath
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";

export function withBasePath(path: string): string {
  if (!normalizedBasePath || !path.startsWith("/")) {
    return path;
  }

  return `${normalizedBasePath}${path}`;
}
