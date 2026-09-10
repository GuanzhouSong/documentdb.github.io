import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Home from '../app/page';
import {
  documentdbVsCodeExtensionMarketplaceUrl,
  documentdbVsCodeLocalQuickStartDeepLink,
} from '../app/services/externalLinks';

const html = renderToStaticMarkup(createElement(Home));

/** The quick start card only, so assertions cannot be satisfied by unrelated page content. */
const card = html.slice(html.indexOf('id="run-with-docker"'));

describe('homepage local quick start', () => {
  it('preserves the public anchor and the terminal path as the default tab', () => {
    expect(html).toContain('id="run-with-docker"');

    // Asserted attribute by attribute: matching a fixed attribute sequence would fail on a
    // no-op JSX prop reorder while telling us nothing extra.
    for (const attr of [
      'id="quickstart-tab-terminal"',
      'aria-selected="true"',
      'aria-controls="quickstart-panel-terminal"',
      'id="quickstart-panel-terminal"',
      'aria-labelledby="quickstart-tab-terminal"',
      'id="quickstart-tab-vscode"',
      'aria-controls="quickstart-panel-vscode"',
      'id="quickstart-panel-vscode"',
      'aria-labelledby="quickstart-tab-vscode"',
    ]) {
      expect(card).toContain(attr);
    }

    // The VS Code panel is the one hidden on first paint, and its tab is out of the tab order.
    expect(card).toMatch(/id="quickstart-panel-vscode"[^>]*hidden=""/);
    expect(card).not.toMatch(/id="quickstart-panel-terminal"[^>]*hidden=""/);
  });

  it('ships a command that is safe to publish and actually parses in a shell', () => {
    // A bare -p publishes on every interface; the guide this card links to calls that out.
    expect(card).toContain('-p 127.0.0.1:10260:10260');
    expect(card).not.toContain('-p 10260:10260 ');
    // Unquoted <PLACEHOLDER> is parsed as a redirection, so the pasted command is a syntax error.
    expect(card).toContain("--username &#x27;&lt;YOUR_USERNAME&gt;&#x27;");
    expect(card).toContain("--password &#x27;&lt;YOUR_PASSWORD&gt;&#x27;");
    expect(card).toContain(
      'ghcr.io/documentdb/documentdb/documentdb-local:latest',
    );
  });

  it('labels the tabs by interface and says the paths share an image, not a container', () => {
    expect(card).toContain('>Terminal</button>');
    expect(card).toContain('>VS Code</button>');
    expect(card).toContain('Both run the same DocumentDB Local image.');
  });

  it('leads with installing the extension, then opening setup', () => {
    expect(documentdbVsCodeExtensionMarketplaceUrl).toBe(
      'https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-documentdb',
    );
    expect(documentdbVsCodeLocalQuickStartDeepLink).toBe(
      'vscode://ms-azuretools.vscode-documentdb/local',
    );
    const marketplace = card.indexOf(
      `href="${documentdbVsCodeExtensionMarketplaceUrl}"`,
    );
    const setup = card.indexOf(
      `href="${documentdbVsCodeLocalQuickStartDeepLink}"`,
    );
    expect(marketplace).toBeGreaterThan(-1);
    expect(setup).toBeGreaterThan(marketplace);
    expect(card).toContain('Install the extension');
    expect(card).toContain('Open setup in VS Code');
  });

  it('states the real Docker prerequisite without overpromising', () => {
    expect(card).toContain('set to Linux');
    expect(card).toContain('running wherever VS Code is');
    // "changes your system" was false: it creates a container and a persistent volume.
    expect(card).toContain('changes nothing else on your machine');
  });

  it('names both wizard clicks and does not guarantee a port it may not get', () => {
    expect(card).toContain('select Continue');
    expect(card).toContain('select Start DocumentDB Local');
    expect(card).toContain('on an available port, 10260 unless it is taken');
  });

  it('carries no pinned extension version, which the guide owns instead', () => {
    // Matched by shape rather than by one literal, so bumping the pin to 0.10.2 is caught
    // too. Deliberately not a bare \d+\.\d+\.\d+, which would match the 127.0.0.1 in the
    // command and the loopback address in the steps.
    expect(card).not.toMatch(/version \d+\.\d+\.\d+/i);
    expect(card).not.toMatch(/\d+\.\d+\.\d+ or (later|newer|above)/i);
    expect(card).not.toMatch(/\bv\d+\.\d+\.\d+\b/);
  });

  it('links both full guides from inside their own panels', () => {
    // Conditionally rendering one link left the VS Code guide out of the exported HTML
    // entirely, since the server renders with the terminal tab active.
    expect(card).toContain('href="/docs/getting-started/docker"');
    expect(card).toContain('href="/docs/getting-started/vscode-quickstart"');
    expect(card).toContain('Full Docker guide');
    expect(card).toContain('Full VS Code guide');

    const vscodePanel = card.slice(card.indexOf('id="quickstart-panel-vscode"'));
    expect(vscodePanel).toContain('href="/docs/getting-started/vscode-quickstart"');
  });

  it('offers a labelled route between the two paths', () => {
    expect(card).toContain('aria-label="Switch to the VS Code tab"');
    expect(card).toContain('aria-label="Switch to the Terminal tab"');
  });

  it('provides a Command Palette fallback that names the likely cause', () => {
    expect(card).toContain(
      'If nothing happens, check that the extension is installed and up to',
    );
    expect(card).toContain('DocumentDB: Set up DocumentDB Local');
    expect(card).toContain('from the Command Palette.');
  });
});
