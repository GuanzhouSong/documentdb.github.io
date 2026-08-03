import Link from "next/link";

export interface VersionTarget {
    label: string;
    href: string;
}

/**
 * Static version dropdown shown on documentation pages. Server-rendered
 * (a <details> disclosure, no client JS) so it works in the static export.
 */
export default function VersionSwitcher({
    current,
    targets,
}: {
    /** Label of the version being viewed (e.g. "current (v0.114-0)"). */
    current: string;
    /** Other versions of this page the reader can switch to. */
    targets: VersionTarget[];
}) {
    return (
        <details className="relative inline-block text-left group">
            <summary className="cursor-pointer list-none inline-flex items-center gap-2 rounded-lg border border-neutral-700/60 bg-neutral-800/60 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:border-neutral-500 transition-colors">
                <svg className="h-3.5 w-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 7h10M7 12h10M7 17h6" />
                </svg>
                Version: {current}
                <svg className="h-3 w-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </summary>
            <div className="absolute z-20 mt-2 w-56 rounded-lg border border-neutral-700/60 bg-neutral-800 p-1 shadow-xl">
                {targets.map((target) => (
                    <Link
                        key={target.href}
                        href={target.href}
                        className="block rounded-md px-3 py-2 text-xs text-gray-300 hover:bg-neutral-700/60 hover:text-white transition-colors"
                    >
                        {target.label}
                    </Link>
                ))}
                <Link
                    href="/docs/versions"
                    className="block rounded-md px-3 py-2 text-xs text-blue-400 hover:bg-neutral-700/60 hover:text-blue-300 transition-colors border-t border-neutral-700/60 mt-1 pt-2"
                >
                    All versions →
                </Link>
            </div>
        </details>
    );
}
