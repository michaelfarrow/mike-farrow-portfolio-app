import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
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
  const res = await fetch(
    'https://raw.githubusercontent.com/michaelfarrow/mike-farrow-portfolio-studio/refs/heads/main/schema.json'
  );
  const buffer = await res.arrayBuffer();
  return await writeFile(destPath('schema.json'), Buffer.from(buffer));
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
}

main();
