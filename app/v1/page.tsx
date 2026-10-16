import Link from "next/link";
import CommandSnippet from "../components/CommandSnippet";
import TelemetryNote from "../components/TelemetryNote";
import {
  documentdbDiscordUrl,
  documentdbReleaseAnnouncementUrl,
  documentdbVsCodeLocalQuickStartDeepLink,
} from "../services/externalLinks";
import { getMetadata } from "../services/metadataService";
import { withBasePath } from "../services/sitePath";

export const metadata = getMetadata({
  title: "DocumentDB 1.0 - Generally Available",
  description:
    "DocumentDB 1.0 is generally available: the MIT-licensed, MongoDB-compatible document database built on PostgreSQL. Install it with Docker, Linux packages, VS Code, or Kubernetes.",
  path: "/v1/",
  extraKeywords: ["DocumentDB 1.0", "release", "GA", "generally available"],
});

const releaseUrl = "https://github.com/documentdb/documentdb/releases/tag/v1.0-0";
const changelogUrl = "https://github.com/documentdb/documentdb/blob/v1.0-0/CHANGELOG.md";
const releaseNotesUrl = "/docs/getting-started/release-notes-1.0";

const dockerCommand = `docker run -dt --name documentdb \\
  -p 127.0.0.1:10260:10260 \\
  ghcr.io/documentdb/documentdb/documentdb-local:latest \\
  --username '<YOUR_USERNAME>' \\
  --password '<YOUR_PASSWORD>'`;

const installerCommand = `curl -fsSLo documentdb-install.sh https://documentdb.io/install.sh &&
sudo sh documentdb-install.sh`;

const helmCommand = `helm install documentdb-operator oci://ghcr.io/documentdb/documentdb-operator \\
  --version 1.0.0 --namespace documentdb-operator --create-namespace --wait`;

const highlights = [
  {
    title: "Security fixes",
    description:
      "find and aggregate with batchSize: 0 run the permission check, $merge and $out require write permission on their target, and user passwords must pass SASLprep.",
  },
  {
    title: "Stability",
    description:
      "Fixes for backend crashes, a concurrent dropIndexes deadlock and RUM index vacuum issues. The gateway returns specific, retryable error codes.",
  },
  {
    title: "Collation",
    description:
      "count, $stdDevPop, $stdDevSamp, $median, $percentile and the symbol BSON type now honor collation.",
  },
  {
    title: "Geospatial",
    description:
      "$near, $nearSphere and $geoNear work on nearly coincident points and at longitude -180 on 2dsphere indexes.",
  },
];

const readMore = [
  { label: "Announcement", title: "DocumentDB 1.0 is here", href: documentdbReleaseAnnouncementUrl },
  { label: "Tools", title: "DocumentDB for VS Code 1.0", href: "/blogs/posts/documentdb-for-vs-code-1-0/" },
  { label: "Kubernetes", title: "DocumentDB 1.0 on Kubernetes", href: "/blogs/posts/kubernetes-operator-versioning/" },
  { label: "Versioning", title: "Long-term support or development?", href: "/blogs/posts/versioning/" },
];

const cardClass = "flex min-w-0 flex-col rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 sm:p-6";
const eyebrowClass = "mb-3 text-xs font-semibold uppercase tracking-[0.24em]";
const linkClass = "font-semibold text-blue-300 transition-colors hover:text-blue-200";

export default function ReleasePage() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.2),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_45%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <p className={`${eyebrowClass} text-emerald-300`}>Generally available · October 19, 2026</p>
          <h1 className="mb-5 text-5xl font-extrabold tracking-tight text-white sm:text-7xl">DocumentDB 1.0</h1>
          <p className="mx-auto mb-4 max-w-3xl text-xl font-semibold tracking-tight text-white sm:text-2xl">
            The open-source, MongoDB-compatible document database built on PostgreSQL.
          </p>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            MIT licensed, with native BSON storage. Use the MongoDB drivers and tools you already know, on a
            database you can run and operate like any other PostgreSQL deployment.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/packages"
              className="inline-flex items-center justify-center rounded-md bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
            >
              Install DocumentDB 1.0
            </Link>
            <a
              href={withBasePath(documentdbReleaseAnnouncementUrl)}
              className="inline-flex items-center justify-center rounded-md border border-neutral-600 bg-neutral-800/40 px-6 py-3 text-sm font-semibold text-gray-200 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
            >
              Read the announcement
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-800 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className={`${eyebrowClass} text-blue-300`}>Get started</p>
          <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">Run 1.0 the way you work</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className={cardClass}>
              <h3 className="mb-2 text-xl font-semibold text-white">Docker</h3>
              <p className="mb-4 text-sm leading-6 text-gray-400">
                Linux, macOS or Windows. Tags <code className="text-gray-300">pg15-1.0.0</code> to{" "}
                <code className="text-gray-300">pg18-1.0.0</code>; <code className="text-gray-300">latest</code> is
                PostgreSQL 17.
              </p>
              <CommandSnippet command={dockerCommand} label="Docker" />
              <TelemetryNote />
              <Link href="/docs/getting-started/docker" className={`mt-auto pt-4 text-sm ${linkClass}`}>
                Docker quick start <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className={cardClass}>
              <h3 className="mb-2 text-xl font-semibold text-white">Linux packages</h3>
              <p className="mb-4 text-sm leading-6 text-gray-400">
                Ubuntu 24.04 and EL9, PostgreSQL 17 or 18, amd64 or arm64, from the documentdb.io APT and YUM
                repositories. On a clean host:
              </p>
              <CommandSnippet command={installerCommand} label="Installer" />
              <Link href="/packages?method=packages" className={`mt-auto pt-4 text-sm ${linkClass}`}>
                apt and dnf commands <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className={cardClass}>
              <h3 className="mb-2 text-xl font-semibold text-white">VS Code</h3>
              <p className="mb-4 text-sm leading-6 text-gray-400">
                DocumentDB for VS Code 1.0 sets up DocumentDB Local for you, then lets you browse, query and
                copy data between connections.
              </p>
              <a
                href={documentdbVsCodeLocalQuickStartDeepLink}
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400 sm:w-auto sm:self-start"
              >
                Set up in VS Code
              </a>
              <Link href="/docs/getting-started/vscode-quickstart" className={`mt-auto pt-4 text-sm ${linkClass}`}>
                VS Code quick start <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className={cardClass}>
              <h3 className="mb-2 text-xl font-semibold text-white">Kubernetes</h3>
              <p className="mb-4 text-sm leading-6 text-gray-400">
                The DocumentDB Kubernetes Operator 1.0.0 ships alongside the engine.
              </p>
              <CommandSnippet command={helmCommand} label="Helm" />
              <Link href="/kubernetes-operator" className={`mt-auto pt-4 text-sm ${linkClass}`}>
                Kubernetes operator <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-800 bg-black/20 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`${eyebrowClass} text-emerald-300`}>What&apos;s in 1.0</p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">A stabilization release</h2>
            </div>
            <a href={changelogUrl} className={`text-sm ${linkClass}`}>
              Full changelog <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-6 text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-800 py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className={`${eyebrowClass} text-blue-300`}>Upgrading</p>
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">Moving to 1.0</h2>
            <ul className="space-y-4 text-sm leading-6 text-gray-300">
              <li>
                <span className="font-semibold text-white">Linux packages from v0.116 or v0.117</span> upgrade in
                place. <Link href="/docs/linux-packages#upgrading" className={linkClass}>Upgrade steps</Link>
              </li>
              <li>
                <span className="font-semibold text-white">Containers:</span> start the 1.0 image on a new volume
                and reload your data; a newer image does not update an existing volume.{" "}
                <Link href="/docs/documentdb-local#upgrading-the-image" className={linkClass}>Upgrading the image</Link>
              </li>
              <li>
                <span className="font-semibold text-white">Release candidates</span> have no upgrade path. Start
                from a clean host or volume.
              </li>
            </ul>
            <p className="mt-6 text-sm text-gray-400">
              <Link href={`${releaseNotesUrl}#known-issues`} className={linkClass}>Known issues</Link>
              {" · "}
              <Link href={releaseNotesUrl} className={linkClass}>Release notes</Link>
              {" · "}
              <a href={releaseUrl} className={linkClass}>v1.0-0 on GitHub</a>
            </p>
          </div>

          <div>
            <p className={`${eyebrowClass} text-blue-300`}>Read more</p>
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">From the blog</h2>
            <div className="grid gap-3">
              {readMore.map((item) => (
                <a
                  key={item.href}
                  href={withBasePath(item.href)}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900/80 px-5 py-4 transition hover:border-blue-400/30 hover:bg-neutral-800/60"
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                      {item.label}
                    </span>
                    <span className="block font-semibold text-white group-hover:text-blue-200">{item.title}</span>
                  </span>
                  <span aria-hidden="true" className="text-blue-300">&rarr;</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 text-center sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">Built in the open</h2>
          <p className="mb-6 text-base leading-7 text-gray-400">
            Try 1.0 with a workload that matters to you, and tell us what you find.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="https://github.com/documentdb/documentdb"
              className="inline-flex items-center justify-center rounded-md border border-neutral-600 bg-neutral-800/40 px-6 py-3 text-sm font-semibold text-gray-200 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
            >
              Star on GitHub
            </a>
            <a
              href={documentdbDiscordUrl}
              className="inline-flex items-center justify-center rounded-md border border-neutral-600 bg-neutral-800/40 px-6 py-3 text-sm font-semibold text-gray-200 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
            >
              Join Discord
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
