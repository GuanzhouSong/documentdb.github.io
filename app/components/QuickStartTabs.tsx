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
  guidedSteps: QuickStartStep[];
  vscodeDeepLinkUrl: string;
  vscodeMarketplaceUrl: string;
  dockerDocsUrl: string;
  vscodeDocsUrl: string;
  existingConnectionDocsUrl: string;
};

const TABS = [
  { id: "command", label: "Docker command", description: "Run it yourself" },
  { id: "guided", label: "Guided setup", description: "VS Code extension" },
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
  guidedSteps,
  vscodeDeepLinkUrl,
  vscodeMarketplaceUrl,
  dockerDocsUrl,
  vscodeDocsUrl,
  existingConnectionDocsUrl,
}: QuickStartTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("command");
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  const selectTab = (id: TabId) => {
    setActiveTab(id);
    tabRefs.current[id]?.focus();
  };

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
        aria-label="Ways to set up DocumentDB locally"
        className="mb-4 grid grid-cols-2 gap-1 rounded-2xl border border-neutral-700 bg-neutral-900/80 p-1"
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
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              onKeyDown={onTabKeyDown}
              className={`min-h-14 min-w-0 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${
                isActive
                  ? "bg-neutral-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
              <span className="mt-1 block text-xs font-normal text-gray-300">
                {tab.description}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="quickstart-panel-command"
        aria-labelledby="quickstart-tab-command"
        hidden={activeTab !== "command"}
      >
        <p className="mb-4 text-sm leading-6 text-gray-300">
          Run the container yourself, then connect with your preferred client.
        </p>
        <CommandSnippet command={dockerCommand} label="bash" />
        <StepList steps={dockerSteps} />
        <div className="mt-4 text-sm">
          <Link
            href={dockerDocsUrl}
            className="font-semibold text-blue-300 transition-colors hover:text-blue-200"
          >
            Docker setup guide
          </Link>
        </div>
      </div>

      <div
        role="tabpanel"
        id="quickstart-panel-guided"
        aria-labelledby="quickstart-tab-guided"
        hidden={activeTab !== "guided"}
      >
        <p className="mb-4 text-sm leading-6 text-gray-300">
          Let the VS Code extension create your local database, generate
          credentials, and save a ready-to-use connection.
        </p>
        <a
          href={vscodeDeepLinkUrl}
          aria-describedby="quickstart-vscode-setup-caption"
          className="inline-flex w-full items-center justify-center rounded-md bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 sm:w-auto"
        >
          Set up in VS Code
        </a>
        <p
          id="quickstart-vscode-setup-caption"
          className="mt-3 text-sm leading-6 text-gray-400"
        >
          Requires{" "}
          <Link
            href="https://code.visualstudio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-300 transition-colors hover:text-blue-200"
          >
            VS Code
          </Link>
          . Opens the setup wizard; VS Code may prompt you to install the{" "}
          <Link
            href={vscodeMarketplaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-300 transition-colors hover:text-blue-200"
          >
            DocumentDB extension
          </Link>
          .
        </p>
        <StepList steps={guidedSteps} />
        <div className="mt-4 text-sm">
          <Link
            href={vscodeDocsUrl}
            className="font-semibold text-blue-300 transition-colors hover:text-blue-200"
          >
            VS Code setup guide
          </Link>
        </div>
      </div>
      <p
        id="quickstart-existing-connection"
        className="mt-5 border-t border-neutral-800 pt-4 text-sm leading-6 text-gray-400"
      >
        Already running DocumentDB?{" "}
        <Link
          href={existingConnectionDocsUrl}
          className="font-semibold text-blue-300 transition-colors hover:text-blue-200"
        >
          Connect your existing instance in VS Code.
        </Link>
      </p>
    </div>
  );
}
