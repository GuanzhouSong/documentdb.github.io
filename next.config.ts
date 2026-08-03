import type { NextConfig } from "next";

const rawBasePath = process.env.NEXT_BASE_PATH?.trim();
const normalizedBasePath = rawBasePath
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
  : undefined;

const nextConfig: NextConfig = {
  output: "export",
  // Emit directory/index.html instead of page.html so GitHub Pages serves
  // both /docs and /docs/ (without this, the trailing-slash form is a 404).
  trailingSlash: true,
  ...(normalizedBasePath
    ? {
        basePath: normalizedBasePath,
        assetPrefix: normalizedBasePath,
      }
    : {}),
  // NEXT_BASE_PATH is a private build variable, so Next strips it from the
  // browser bundle. Anything that prefixes a path by hand - a plain anchor to
  // a route Next does not own, an image src - also runs in client components,
  // where reading it directly yields one value during the static render and
  // another after hydration. Republishing the normalized value under a
  // NEXT_PUBLIC_ name inlines it into both bundles, while deployments keep
  // setting the single variable they already set.
  env: {
    NEXT_PUBLIC_BASE_PATH: normalizedBasePath ?? "",
  },
};

export default nextConfig;
