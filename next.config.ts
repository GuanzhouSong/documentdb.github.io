import type { NextConfig } from "next";

const rawBasePath = process.env.NEXT_BASE_PATH?.trim();
const normalizedBasePath = rawBasePath
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
  : undefined;

const nextConfig: NextConfig = {
  output: "export",
  // Expose the base path to client components (Markdown link resolution);
  // next/link handles it automatically but raw anchors in markdown do not.
  env: {
    NEXT_PUBLIC_BASE_PATH: normalizedBasePath ?? "",
  },
  // Emit directory/index.html instead of page.html so GitHub Pages serves
  // both /docs and /docs/ (without this, the trailing-slash form is a 404).
  trailingSlash: true,
  ...(normalizedBasePath
    ? {
        basePath: normalizedBasePath,
        assetPrefix: normalizedBasePath,
      }
    : {}),
};

export default nextConfig;
