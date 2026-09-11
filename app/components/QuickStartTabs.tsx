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
  /** Marketplace page, linked from the caption so the install is explained, not hidden. */
  vscodeMarketplaceUrl: string;
  /** Full guide for each path, linked from the footer of the matching panel. */
  dockerDocsUrl: string;
  /**
   * The guide's setup section, which lists every other way to open the wizard. This is the
   * only place the panel points at when the deep link does nothing.
   */
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

/**
 * Shown only after the setup button is used. VS Code's install-on-link can fail with
 * "No extension gallery service configured" when the link is also what starts VS Code and a
 * managed marketplace policy delays the gallery until the account is verified; a second
 * click once VS Code is up succeeds. Rendering this after the click keeps that caveat out of
 * the happy path for everyone who has not clicked yet.
 */
export const setupRetryHint =
  "VS Code should now open and offer to install the extension. If VS Code had to start first, it can report an error before it is ready. Select Set up in VS Code again once it has loaded.";

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
  const [setupOpened, setSetupOpened] = useState(false);
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
        {/*
          No Docker prerequisite here. Both paths need Docker and the Terminal tab does not say
          so, so saying it only here made the guided path look like the one with extra
          requirements. The guide covers Docker properly, readiness states included.
        */}
        <p className="mb-4 text-sm leading-6 text-gray-300">
          <strong className="font-semibold text-white">
            Choose this for the smoothest experience.
          </strong>{" "}
          VS Code sets up DocumentDB Local and creates a ready-to-use connection
          for you. One click, then follow the wizard.
        </p>
        {/*
          One button carries the whole flow. VS Code itself offers to install a missing
          extension when a vscode:// link targets it, then re-opens the link, so a separate
          "Install the extension" action was a step the visitor never has to take.
        */}
        <a
          href={vscodeDeepLinkUrl}
          aria-describedby="quickstart-vscode-setup-caption"
          onClick={() => setSetupOpened(true)}
          className="inline-flex w-full items-center justify-center rounded-md bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400 sm:w-auto"
        >
          Set up in VS Code
        </a>
        <p
          id="quickstart-vscode-setup-caption"
          className="mt-2.5 text-sm leading-6 text-gray-400"
        >
          Opens VS Code, asks to install the{" "}
          <Link
            href={vscodeMarketplaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-300 underline decoration-neutral-600 underline-offset-2 transition-colors hover:text-white"
          >
            DocumentDB for VS Code
          </Link>{" "}
          extension if you do not have it yet, and launches the wizard.
        </p>
        {setupOpened && (
          <p
            role="status"
            className="mt-3 rounded-md border border-blue-400/20 bg-blue-500/10 px-3.5 py-2.5 text-sm leading-6 text-gray-200"
          >
            {setupRetryHint}
          </p>
        )}
        <StepList steps={vscodeSteps} />
        {/*
          Troubleshooting stays out of the happy path: a link, after the steps, rather than a
          "if nothing happens" paragraph in front of someone who has not clicked yet.
        */}
        <p className="mt-4 text-sm leading-6 text-gray-400">
          Not working in VS Code? The{" "}
          <Link
            href={vscodeDocsUrl}
            className="font-semibold text-blue-300 transition-colors hover:text-blue-200"
          >
            setup guide
          </Link>{" "}
          shows how to open the wizard from the activity bar or the Command
          Palette.
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
      </div>
    </div>
  );
}
