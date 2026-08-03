import Link from "next/link";
import { notFound } from "next/navigation";
import { capitalCase } from "change-case";
import {
    getAllVersionedArticlePaths,
    getVersionedArticleByPath,
} from "../../../../../services/versionService";
import { getArticleByPath } from "../../../../../services/articleService";
import Markdown from "../../../../../components/Markdown";
import VersionSwitcher from "../../../../../components/VersionSwitcher";

export async function generateStaticParams() {
    return getAllVersionedArticlePaths().map((path) => ({
        version: path.version,
        section: path.section,
        slug: path.slug,
    }));
}

interface PageProps {
    params: Promise<{
        version: string;
        section: string;
        slug?: string[];
    }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { version, section, slug = [] } = await params;
    const articleData = getVersionedArticleByPath(version, section, slug);
    const pageTitle = articleData?.frontmatter.title || section;

    return {
        title: `${pageTitle} (${version}) - DocumentDB Documentation`,
        description: articleData?.frontmatter.description || "",
        // Archived versions must never outrank the current documentation in
        // search results.
        robots: { index: false, follow: false },
    };
}

export default async function VersionedArticlePage({ params }: PageProps) {
    const { version, section, slug = [] } = await params;
    const articleData = getVersionedArticleByPath(version, section, slug);

    if (!articleData) {
        return notFound();
    }

    const { content, frontmatter, navigation, file } = articleData;
    const pageTitle = frontmatter.title || section;
    const sectionTitle = capitalCase(section)
        .replace(/documentdb/i, "DocumentDB")
        .replace(/api/i, "API");

    // Link the banner to the same page in the current docs when it still
    // exists there, otherwise to the section root.
    const currentEquivalent = getArticleByPath(section, slug)
        ? slug.length > 0
            ? `/docs/${section}/${slug.join("/")}`
            : `/docs/${section}`
        : "/docs";

    const navigationLinks = navigation.map((item) => (
        <Link
            key={item.link}
            href={item.link}
            className="block w-full text-left px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-neutral-700/50 transition-all duration-200"
        >
            {item.title}
        </Link>
    ));

    return (
        <div className="min-h-screen bg-neutral-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black"></div>

            <div className="relative flex min-h-screen">
                {/* Left Sidebar */}
                <div className="hidden w-80 bg-neutral-800/50 backdrop-blur-sm border-r border-neutral-700/50 md:flex flex-col">
                    <div className="p-6 border-b border-neutral-700/50">
                        <Link
                            href="/docs"
                            className="text-blue-400 hover:text-blue-300 text-sm mb-4 flex items-center transition-colors"
                        >
                            ← Back to Documentation
                        </Link>
                        <p className="text-2xl font-bold text-white">{sectionTitle}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
                            {version} snapshot
                        </p>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        <nav className="space-y-1">{navigationLinks}</nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    <div className="max-w-4xl">
                        {/* Old-version banner */}
                        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-amber-200">
                                You are viewing the frozen documentation for{" "}
                                <span className="font-semibold">{version}</span>. It is not
                                updated and may not reflect the latest release.
                            </p>
                            <Link
                                href={currentEquivalent}
                                className="inline-flex shrink-0 items-center rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:bg-amber-500/30 transition-colors"
                            >
                                View current version →
                            </Link>
                        </div>

                        <div className="mb-6">
                            <VersionSwitcher
                                current={version}
                                targets={[
                                    { label: "current (latest release)", href: currentEquivalent },
                                ]}
                            />
                        </div>

                        <Markdown content={content} />
                    </div>
                </div>
            </div>
        </div>
    );
}
