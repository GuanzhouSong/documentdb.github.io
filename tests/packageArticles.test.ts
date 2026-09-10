import { describe, expect, it } from 'vitest';
import {
  getArticleByPath,
  linuxPackagesGuideContent,
  linuxPackagesOperationsContent,
} from '../app/services/articleService';

function getCodeBlocks(content: string, language: string): string[] {
  const pattern = new RegExp('```' + language + '\\n([\\s\\S]*?)\\n```', 'g');
  return Array.from(content.matchAll(pattern), (match) => match[1]);
}

describe('Linux package articles', () => {
  it('keeps advanced setup details out of the quick start', () => {
    expect(linuxPackagesGuideContent).toContain(
      '/docs/linux-packages#unattended-setup',
    );
    expect(linuxPackagesGuideContent).toContain(
      '/docs/linux-packages#adopt-an-existing-postgre-sql-instance',
    );
    expect(linuxPackagesGuideContent).not.toContain('--admin-password-stdin');
    expect(linuxPackagesGuideContent).not.toContain('--target-postgres-instance');
  });

  it('documents the supported brownfield adoption workflow', () => {
    expect(linuxPackagesOperationsContent).toContain(
      '## Adopt an existing PostgreSQL instance',
    );
    expect(linuxPackagesOperationsContent).toContain(
      'sudo documentdb-setup --target-postgres-instance 18/main --admin-user admin',
    );
    expect(linuxPackagesOperationsContent).toContain(
      'The wizard intentionally does not restart an adopted',
    );
    expect(linuxPackagesOperationsContent).toContain(
      'DOCUMENTDB_TOAST_COMPRESSION=default',
    );
  });

  it('distinguishes scoped systemd restore from no-systemd cleanup', () => {
    expect(linuxPackagesOperationsContent).toContain(
      'sudo documentdb-setup --restore --pg-version 18',
    );
    expect(linuxPackagesOperationsContent).toContain(
      'sudo documentdb-setup --restore --yes',
    );
    expect(linuxPackagesOperationsContent).toMatch(
      /A scoped restore alone is not\s+sufficient on a no-systemd host\./,
    );
    expect(linuxPackagesOperationsContent).toContain(
      'Restart the adopted PostgreSQL service after restore',
    );
    expect(linuxPackagesOperationsContent).toContain(
      "the command should produce no output",
    );
  });

  it('provides a complete unattended setup command', () => {
    expect(linuxPackagesOperationsContent).toContain(
      `printf '%s' "$ADMIN_PW" | sudo documentdb-setup --pg-version 18`,
    );
    expect(linuxPackagesOperationsContent).toContain(
      '--use-new-postgres-instance --admin-user admin --admin-password-stdin --yes',
    );
  });

  it('uses the current release package guide and artifact version', () => {
    const offlineGuide = getArticleByPath('linux-packages', ['offline']);

    expect(linuxPackagesGuideContent).toContain(
      'documentdb/blob/v0.117-0/packaging/README.md',
    );
    expect(linuxPackagesGuideContent).toContain(
      '`--load-sample-data` to the setup command to seed the `StoreData` database',
    );
    expect(offlineGuide?.content).toContain(
      'ubuntu24.04-postgresql-18-documentdb_0.117-0_amd64.deb',
    );
    expect(offlineGuide?.content).toContain(
      'pass the five packages for the selected PostgreSQL major',
    );
    expect(offlineGuide?.content).toContain(
      'For PostgreSQL 18 only, the optional `documentdb` meta package may be included',
    );
    expect(offlineGuide?.content).toContain('`documentdb-common`');
    expect(offlineGuide?.content).toContain('`documentdb-gateway`');
    expect(offlineGuide?.content).toContain('`documentdb-postgresql-tools`');
    expect(offlineGuide?.content).not.toContain('pass all six files');
    expect(linuxPackagesOperationsContent).not.toContain(
      '## Known issues in 0.116',
    );
  });

  it('keeps package setup rerunnable and reinstall wording data-safe', async () => {
    const packageBlocks = getCodeBlocks(linuxPackagesGuideContent, 'bash');
    const mongoRepositoryBlock = packageBlocks.find((block) =>
      block.includes('https://pgp.mongodb.com/server-8.0.asc'),
    );

    expect(mongoRepositoryBlock).toContain(
      'gpg --dearmor --yes -o /usr/share/keyrings/mongodb.gpg',
    );
    expect(linuxPackagesOperationsContent).toContain(
      'Removing packages alone does not',
    );
    expect(linuxPackagesOperationsContent).toContain(
      'package removal preserves PostgreSQL data and in-database content',
    );
    expect(linuxPackagesOperationsContent).not.toContain(
      'remove the earlier packages and perform the current',
    );

    const { readFile } = await import('node:fs/promises');
    const { fileURLToPath } = await import('node:url');
    const packageInstall = await readFile(
      fileURLToPath(new URL('../PACKAGE-INSTALL.md', import.meta.url)),
      'utf8',
    );

    expect(packageInstall).toContain(
      'five packages for the selected PostgreSQL major',
    );
    expect(packageInstall).toContain(
      'the optional `documentdb` meta package may be included',
    );
    expect(packageInstall).toContain(
      'Removing packages',
    );
    expect(packageInstall).toContain(
      'alone does not create a fresh database',
    );
    expect(packageInstall).not.toContain('Pass the whole set');
  });

  it('does not list the fixed setup core-version update as a current issue', () => {
    expect(linuxPackagesOperationsContent).not.toContain(
      'does not run `ALTER EXTENSION documentdb_core UPDATE`',
    );
    expect(linuxPackagesOperationsContent).toContain(
      'ALTER EXTENSION documentdb_core UPDATE;',
    );
  });

  it('documents the current opt-in StoreData sample', async () => {
    const dockerGuide = getArticleByPath('getting-started', ['docker']);
    expect(dockerGuide?.content).toContain('use StoreData');
    expect(dockerGuide?.content).toContain(
      '41,505 documents in `stores` and 2 documents in `ratings`',
    );
    expect(dockerGuide?.content).toContain(
      'Existing volumes are not migrated automatically',
    );
    expect(dockerGuide?.content).not.toContain('use sampledb');

    const { readFile } = await import('node:fs/promises');
    const { fileURLToPath } = await import('node:url');
    const source = await readFile(
      fileURLToPath(new URL('../app/services/articleService.ts', import.meta.url)),
      'utf8',
    );

    expect(source).toContain(
      '41,505 store documents and 2 rating documents',
    );
    expect(source).toContain(
      'documentdb-local:pg18-0.117.0',
    );
    expect(source).toContain(
      'Currently identical to \\`pg17-0.117.0\\`',
    );
    expect(source).not.toContain(
      '5 users, 5 products, 4 orders, and 2',
    );
  });

  it('keeps executable local Docker recipes on loopback with explicit credentials', async () => {
    const quickStarts = [
      'docker',
      'vscode-quickstart',
      'nodejs-setup',
      'python-setup',
      'mongo-shell-quickstart',
    ];

    for (const slug of quickStarts) {
      const article = getArticleByPath('getting-started', [slug]);
      if (!article) {
        throw new Error(`Missing curated article getting-started/${slug}`);
      }

      const dockerBlocks = getCodeBlocks(article.content, 'bash').filter(
        (block) =>
          block.includes('docker run') &&
          block.includes('ghcr.io/documentdb/documentdb/documentdb-local'),
      );

      expect(dockerBlocks.length, slug).toBeGreaterThan(0);
      for (const block of dockerBlocks) {
        expect(block, slug).toContain('-p 127.0.0.1:10260:10260');
        expect(block, slug).not.toContain('-p 10260:10260');
        expect(block, slug).not.toContain('--username <YOUR_USERNAME>');
        expect(block, slug).not.toContain('--password <YOUR_PASSWORD>');
      }
    }

    const { readFile } = await import('node:fs/promises');
    const { fileURLToPath } = await import('node:url');
    const articleSource = await readFile(
      fileURLToPath(new URL('../app/services/articleService.ts', import.meta.url)),
      'utf8',
    );
    const packagePageSource = await readFile(
      fileURLToPath(new URL('../app/packages/page.tsx', import.meta.url)),
      'utf8',
    );

    expect(articleSource).toContain(
      'docker run -dt -p 127.0.0.1:10260:10260 --name documentdb',
    );
    expect(articleSource).toContain(
      "  --username '<YOUR_USERNAME>' --password '<YOUR_PASSWORD>' --init-data true",
    );
    expect(articleSource).toContain(
      '  -p 127.0.0.1:10260:10260 \\\\',
    );
    expect(articleSource).toContain(
      '  -v /path/to/init/scripts:/init_doc_db.d \\\\',
    );
    expect(packagePageSource).toContain(
      '  -p 127.0.0.1:10260:10260 \\\\',
    );
    expect(packagePageSource).toContain(
      "  --username '<YOUR_USERNAME>' \\\\",
    );
    expect(packagePageSource).toContain(
      "  --password '<YOUR_PASSWORD>'",
    );
  });

  it('passes Node.js and Python credentials outside connection URIs', () => {
    const nodeGuide = getArticleByPath('getting-started', ['nodejs-setup']);
    const pythonGuide = getArticleByPath('getting-started', ['python-setup']);

    if (!nodeGuide || !pythonGuide) {
      throw new Error('Missing curated driver quick start');
    }

    const nodeBlocks = getCodeBlocks(nodeGuide.content, 'javascript');
    const nodeMain = nodeBlocks.find((block) =>
      block.includes('process.env.DOCUMENTDB_USERNAME'),
    );
    const nodeTrusted = nodeBlocks.find((block) =>
      block.includes('tlsCAFile'),
    );

    expect(nodeGuide.content).not.toContain(
      'mongodb://<YOUR_USERNAME>:<YOUR_PASSWORD>',
    );
    expect(nodeMain).toContain('process.env.DOCUMENTDB_PASSWORD');
    expect(nodeMain).toContain('if (!username || !password)');
    expect(nodeMain).toContain('auth: { username, password }');
    expect(nodeMain).toContain('authSource: "admin"');
    expect(nodeMain).toContain('new MongoClient(uri, options)');
    expect(nodeTrusted).toContain('auth: { username, password }');
    expect(nodeTrusted).toContain('authSource: "admin"');
    expect(nodeTrusted).not.toContain('<YOUR_PASSWORD>');

    const pythonBlocks = getCodeBlocks(pythonGuide.content, 'python');
    const pythonMain = pythonBlocks.find((block) =>
      block.includes('os.environ.get("DOCUMENTDB_USERNAME")'),
    );
    const pythonTrusted = pythonBlocks.find((block) =>
      block.includes('tlsCAFile'),
    );

    expect(pythonGuide.content).not.toContain(
      'mongodb://<YOUR_USERNAME>:<YOUR_PASSWORD>',
    );
    expect(pythonMain).toContain('os.environ.get("DOCUMENTDB_PASSWORD")');
    expect(pythonMain).toContain('if not username or not password:');
    expect(pythonMain).toContain('username=username');
    expect(pythonMain).toContain('password=password');
    expect(pythonTrusted).toContain('username=username');
    expect(pythonTrusted).toContain('password=password');
    expect(pythonTrusted).not.toContain('<YOUR_PASSWORD>');

    const nodeDockerBlock = getCodeBlocks(nodeGuide.content, 'bash').find(
      (block) => block.includes('docker run'),
    );
    const pythonDockerBlock = getCodeBlocks(pythonGuide.content, 'bash').find(
      (block) => block.includes('docker run'),
    );

    for (const block of [nodeDockerBlock, pythonDockerBlock]) {
      expect(block).toContain("export DOCUMENTDB_USERNAME='<YOUR_USERNAME>'");
      expect(block).toContain("export DOCUMENTDB_PASSWORD='<YOUR_PASSWORD>'");
      expect(block).toContain(
        '${DOCUMENTDB_USERNAME:?Set DOCUMENTDB_USERNAME}',
      );
      expect(block).toContain(
        '${DOCUMENTDB_PASSWORD:?Set DOCUMENTDB_PASSWORD}',
      );
    }
  });

  it('keeps Package Finder advanced hints linked and version-agnostic', async () => {
    const { readFile } = await import('node:fs/promises');
    const { fileURLToPath } = await import('node:url');
    const source = await readFile(
      fileURLToPath(new URL('../app/packages/page.tsx', import.meta.url)),
      'utf8',
    );

    expect(source).toContain('href="/docs/linux-packages#unattended-setup"');
    expect(source).toContain('--load-sample-data</code> to seed the{" "}');
    expect(source).toContain('individual subpackages can carry');
    expect(source).not.toContain('and the gateway are');
  });
});
