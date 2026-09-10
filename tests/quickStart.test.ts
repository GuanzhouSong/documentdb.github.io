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
  it('preserves the public anchor and the terminal path as the default tab', () => {
    expect(html).toContain('id="run-with-docker"');
    expect(html).toMatch(
      /id="quickstart-tab-terminal" aria-selected="true" aria-controls="quickstart-panel-terminal" tabindex="0"/,
    );
    expect(html).toMatch(
      /id="quickstart-tab-vscode" aria-selected="false" aria-controls="quickstart-panel-vscode" tabindex="-1"/,
    );
    expect(html).toMatch(
      /id="quickstart-panel-terminal" aria-labelledby="quickstart-tab-terminal">/,
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

  it('labels the tabs by interface rather than implying one path avoids Docker', () => {
    expect(html).toContain('>Terminal</button>');
    expect(html).toContain('>VS Code</button>');
    expect(html).toContain(
      'Both start the same DocumentDB Local container.',
    );
  });

  it('leads with installing the extension, then opening setup', () => {
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
    expect(html).toContain('Install the extension');
    expect(html).toContain('Open setup in VS Code');
  });

  it('states that the VS Code path still needs Docker and changes nothing else', () => {
    expect(html).toContain(
      'Needs Docker Desktop or Docker Engine on the same machine as VS Code.',
    );
    expect(html).toContain('It never installs Docker or changes your system.');
  });

  it('describes the setup outcome without pinning an extension version', () => {
    expect(html).toContain(
      'Install the free DocumentDB for VS Code extension from the Marketplace.',
    );
    expect(html).toContain(
      'The wizard starts DocumentDB Local with defaults you can review.',
    );
    expect(html).toContain(
      'You get a container on port 10260 with generated credentials.',
    );
    // A pinned minimum version on the homepage rots; the guide carries it instead.
    expect(html).not.toContain('0.10.1');
  });

  it('gives each path a concrete first query and a full guide', () => {
    expect(html).toContain(
      'Connect on port 10260 with mongosh, any MongoDB driver, or your app.',
    );
    expect(html).toContain('Run your first query.');
    expect(html).toContain('href="/docs/getting-started/docker"');
    expect(html).toContain('Full Docker guide');
  });

  it('provides a Command Palette fallback that names the likely cause', () => {
    expect(html).toContain(
      'If nothing happens, check that the extension is installed and up to',
    );
    expect(html).toContain('DocumentDB: Set up DocumentDB Local');
    expect(html).toContain('from the Command Palette.');
  });
});
