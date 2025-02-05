import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

import rootPackage from '../package.json';

const REPO = 'michaelfarrow/mike-farrow-portfolio-studio';
const DEST = '.studio';
const REF = rootPackage.studio.ref;

function repoPath(p: string) {
  return `https://raw.githubusercontent.com/${REPO}/refs/heads/${REF}/${p}`;
}

function destPath(p: string) {
  return path.resolve(DEST, p);
}

function ensureDest() {
  return mkdir(DEST, { recursive: true });
}

async function fetchSchema() {
  const res = await fetch(repoPath('schema.json'));
  const buffer = await res.arrayBuffer();
  return await writeFile(destPath('schema.json'), Buffer.from(buffer));
}

async function fetchResolver() {
  const res = await fetch(repoPath('presentation/resolve.ts'));
  const buffer = await res.arrayBuffer();
  return await writeFile(
    path.resolve('.', 'src/lib/sanity/resolve.ts'),
    Buffer.from(buffer)
  );
}

async function fetchVersion() {
  const res = await fetch(repoPath('package.json'));
  const p = await res.json();
  return await writeFile(destPath('version'), p.dependencies.sanity);
}

async function main() {
  await ensureDest();
  await fetchVersion();
  await fetchSchema();
  await fetchResolver();
}

main();
