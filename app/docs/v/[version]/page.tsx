import Link from "next/link";
import { notFound } from "next/navigation";
import { capitalCase } from "change-case";
import { getDocVersions, getVersionedSections } from "../../../services/versionService";

export async function generateStaticParams() {
    return getDocVersions().map((version) => ({ version }));
}

interface PageProps {
    params: Promise<{ version: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { version } = await params;
    return {
        title: `${version} Documentation - DocumentDB`,
        description: `Archived DocumentDB documentation for ${version}.`,
        robots: { index: false, follow: false },
    };
}

export default async function VersionLandingPage({ params }: PageProps) {
    const { version } = await params;
    const sections = getVersionedSections(version);

    if (sections.length === 0) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-neutral-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black"></div>

            <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-8">
                <div className="mb-8 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
                    <p className="text-sm text-amber-200">
                        This is the frozen documentation snapshot for{" "}
                        <span className="font-semibold">{version}</span>.{" "}
                        <Link href="/docs" className="font-semibold text-amber-100 underline hover:text-white">
                            Switch to the current documentation →
                        </Link>
                    </p>
                </div>

                <h1 className="text-4xl font-bold text-white">
                    DocumentDB {version} Documentation
                </h1>
                <p className="mt-3 text-gray-400">
                    Documentation sections as they were at the {version} release.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    {sections.map((section) => (
                        <Link
                            key={section}
                            href={`/docs/v/${version}/${section}`}
                            className="rounded-xl border border-neutral-700/60 bg-neutral-800/50 p-5 transition-colors hover:border-blue-500/50 hover:bg-neutral-800"
                        >
                            <p className="font-semibold text-white">
                                {capitalCase(section)
                                    .replace(/documentdb/i, "DocumentDB")
                                    .replace(/api/i, "API")}
                            </p>
                            <p className="mt-1 text-sm text-gray-400">
                                {section} docs at {version}
                            </p>
                        </Link>
                    ))}
                </div>

                <p className="mt-10 text-sm text-gray-500">
                    Looking for a different version? See{" "}
                    <Link href="/docs/versions" className="text-blue-400 hover:text-blue-300">
                        all documentation versions
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
