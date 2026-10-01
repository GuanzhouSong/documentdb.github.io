import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const installerSource = {
  revision: '2b0321c94daebdd6a5327b641069af0d0036997b',
  sha256: 'b42077317d3eed19ac6090b757c59ce20b2f6a07b912cd4e134fd4cef7e3da0c',
};

export async function publishInstaller(outputDirectory = 'out') {
  if (!/^[a-f0-9]{40}$/.test(installerSource.revision) ||
      !/^[a-f0-9]{64}$/.test(installerSource.sha256)) {
    throw new Error('Installer source must have a pinned commit and SHA256');
  }
  const url = `https://raw.githubusercontent.com/documentdb/documentdb/${installerSource.revision}/packaging/install.sh`;
  const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) {
    throw new Error(`Installer download failed: HTTP ${response.status}`);
  }
  const script = Buffer.from(await response.arrayBuffer());
  const digest = createHash('sha256').update(script).digest('hex');
  if (digest !== installerSource.sha256) {
    throw new Error(`Installer checksum mismatch: ${digest}`);
  }
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(resolve(outputDirectory, 'install.sh'), script);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await publishInstaller();
}
