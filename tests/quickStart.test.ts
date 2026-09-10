import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Home from '../app/page';
import {
  documentdbVsCodeExtensionMarketplaceUrl,
  documentdbVsCodeLocalQuickStartDeepLink,
} from '../app/services/externalLinks';

const html = renderToStaticMarkup(createElement(Home));

describe('homepage local quick start', () => {
  it('preserves the public anchor and Docker as the default tab', () => {
    expect(html).toContain('id="run-with-docker"');
    expect(html).toMatch(
      /id="quickstart-tab-docker" aria-selected="true" aria-controls="quickstart-panel-docker" tabindex="0"/,
    );
    expect(html).toMatch(
      /id="quickstart-tab-vscode" aria-selected="false" aria-controls="quickstart-panel-vscode" tabindex="-1"/,
    );
    expect(html).toMatch(
      /id="quickstart-panel-docker" aria-labelledby="quickstart-tab-docker">/,
    );
    expect(html).toMatch(
      /id="quickstart-panel-vscode" aria-labelledby="quickstart-tab-vscode" hidden=""/,
    );
    expect(html).toContain('docker run -dt --name documentdb');
    expect(html).toContain('-p 10260:10260');
    expect(html).toContain(
      'ghcr.io/documentdb/documentdb/documentdb-local:latest',
    );
  });

  it('offers the marketplace before the supported local setup deep link', () => {
    expect(documentdbVsCodeExtensionMarketplaceUrl).toBe(
      'https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-documentdb',
    );
    expect(documentdbVsCodeLocalQuickStartDeepLink).toBe(
      'vscode://ms-azuretools.vscode-documentdb/local',
    );
    const marketplace = html.indexOf(
      `href="${documentdbVsCodeExtensionMarketplaceUrl}"`,
    );
    const setup = html.indexOf(
      `href="${documentdbVsCodeLocalQuickStartDeepLink}"`,
    );
    expect(marketplace).toBeGreaterThan(-1);
    expect(setup).toBeGreaterThan(marketplace);
  });

  it('states the shipped minimum version and Docker prerequisite', () => {
    expect(html).toContain('version 0.10.1 or later');
    expect(html).toContain(
      'Requires Docker Engine or Docker Desktop running Linux containers in your VS Code environment.',
    );
  });

  it('describes the setup actions and provides a Command Palette fallback', () => {
    expect(html).toContain(
      'Select Open setup when VS Code confirms the link, then Continue, review the defaults, and select Start DocumentDB Local.',
    );
    expect(html).toContain(
      'When setup finishes, select Open Connection to browse data and run queries.',
    );
    expect(html).toContain('If the link does not open setup, run ');
    expect(html).toContain('DocumentDB: Set up DocumentDB Local');
    expect(html).toContain('from the VS Code Command Palette.');
  });
});
