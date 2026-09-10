"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import CommandSnippet from "./CommandSnippet";

export type QuickStartStep = {
  step: string;
  description: string;
};

type QuickStartTabsProps = {
  dockerCommand: string;
  dockerSteps: QuickStartStep[];
  vscodeSteps: QuickStartStep[];
  /** Deep link that opens the extension's DocumentDB Local setup wizard. */
  vscodeDeepLinkUrl: string;
  /** Marketplace page, for visitors who do not have the extension yet. */
  vscodeMarketplaceUrl: string;
  /** Full guide for each path, linked from the footer of the matching panel. */
  dockerDocsUrl: string;
  vscodeDocsUrl: string;
};

// "Terminal" rather than "Docker": both paths run the same Docker image, and labelling one of
// them "Docker" implies the other avoids Docker.
const TABS = [
  { id: "terminal", label: "Terminal" },
  { id: "vscode", label: "VS Code" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function StepList({ steps }: { steps: QuickStartStep[] }) {
  return (
    <ol className="mt-5 overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/50">
      {steps.map((item) => (
        <li
          key={item.step}
          className="grid grid-cols-[auto_1fr] items-start gap-3 border-t border-neutral-800/80 px-4 py-3.5 first:border-t-0"
        >
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-[11px] font-semibold text-blue-200">
            {item.step}
          </span>
          <p className="text-sm leading-6 text-gray-300">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}

export default function QuickStartTabs({
  dockerCommand,
  dockerSteps,
  vscodeSteps,
  vscodeDeepLinkUrl,
  vscodeMarketplaceUrl,
  dockerDocsUrl,
  vscodeDocsUrl,
}: QuickStartTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("terminal");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectTab = (id: TabId) => {
    setActiveTab(id);
    tabRefs.current[id]?.focus();
  };

  // Arrow keys move between tabs, which is what a tablist is expected to do; without it the
  // only way through is Tab, and that leaves the panel. Home/End jump to the ends, per the
  // ARIA authoring practices for tabs.
  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);

    switch (event.key) {
      case "ArrowRight":
      case "ArrowLeft": {
        event.preventDefault();
        const delta = event.key === "ArrowRight" ? 1 : -1;
        selectTab(TABS[(currentIndex + delta + TABS.length) % TABS.length].id);
        break;
      }
      case "Home":
        event.preventDefault();
        selectTab(TABS[0].id);
        break;
      case "End":
        event.preventDefault();
        selectTab(TABS[TABS.length - 1].id);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Ways to run DocumentDB locally"
        className="mb-4 flex w-full rounded-full border border-neutral-700 bg-neutral-900/80 p-1 sm:inline-flex sm:w-auto"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[tab.id] = element;
              }}
              type="button"
              role="tab"
              id={`quickstart-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`quickstart-panel-${tab.id}`}
              // Only the selected tab is in the tab order; arrow keys move between them.
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={onTabKeyDown}
              // Solid active state so the tablist reads as a control rather than as another
              // badge next to the "Quick start" chip and the numbered step markers.
              className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition-colors sm:flex-none ${
                isActive
                  ? "bg-neutral-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="quickstart-panel-terminal"
        aria-labelledby="quickstart-tab-terminal"
        hidden={activeTab !== "terminal"}
      >
        <CommandSnippet command={dockerCommand} label="bash" />
        <StepList steps={dockerSteps} />
        <p className="mt-4 text-sm leading-6 text-gray-400">
          Want a GUI? The{" "}
          <button
            type="button"
            onClick={() => selectTab("vscode")}
            aria-label="Switch to the VS Code tab"
            className="font-semibold text-blue-300 underline-offset-2 transition-colors hover:text-blue-200 hover:underline"
          >
            VS Code extension
          </button>{" "}
          connects to this container too.
        </p>
        <div className="mt-4 text-sm">
          <Link
            href={dockerDocsUrl}
            className="font-semibold text-blue-300 transition-colors hover:text-blue-200"
          >
            Full Docker guide
          </Link>
        </div>
      </div>

      <div
        role="tabpanel"
        id="quickstart-panel-vscode"
        aria-labelledby="quickstart-tab-vscode"
        hidden={activeTab !== "vscode"}
      >
        <p className="mb-4 text-sm leading-6 text-gray-400">
          This path needs Docker Desktop or Docker Engine, set to Linux
          containers, running wherever VS Code is: your machine, or your WSL,
          dev container, or SSH remote. The extension pulls the image, starts
          it, and saves the connection for you. It never installs Docker, and it
          changes nothing else on your machine.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={vscodeMarketplaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-blue-400/30 bg-blue-500/20 px-4 py-2.5 text-sm font-semibold text-blue-100 transition-colors hover:bg-blue-500/30"
          >
            Install the extension
          </Link>
          <a
            href={vscodeDeepLinkUrl}
            className="inline-flex items-center justify-center rounded-md border border-neutral-600 px-4 py-2.5 text-sm font-semibold text-gray-200 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
          >
            Open setup in VS Code
          </a>
        </div>
        <StepList steps={vscodeSteps} />
        <p className="mt-4 text-sm leading-6 text-gray-400">
          If nothing happens, check that the extension is installed and up to
          date, then run{" "}
          <strong className="font-semibold text-gray-300">
            DocumentDB: Set up DocumentDB Local
          </strong>{" "}
          from the Command Palette.
        </p>
        <p className="mt-4 text-sm leading-6 text-gray-400">
          Prefer to start it yourself? The{" "}
          <button
            type="button"
            onClick={() => selectTab("terminal")}
            aria-label="Switch to the Terminal tab"
            className="font-semibold text-blue-300 underline-offset-2 transition-colors hover:text-blue-200 hover:underline"
          >
            Terminal
          </button>{" "}
          tab runs the same image with one command.
        </p>
        <div className="mt-4 text-sm">
          <Link
            href={vscodeDocsUrl}
            className="font-semibold text-blue-300 transition-colors hover:text-blue-200"
          >
            Full VS Code guide
          </Link>
        </div>
      </div>
    </div>
  );
}
