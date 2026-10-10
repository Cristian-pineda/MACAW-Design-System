import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function readJsonIfExists<T>(path: string): Promise<T | undefined> {
  if (!existsSync(path)) return undefined;
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

export async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value, null, 2) + '\n');
}

export async function copyDir(from: string, to: string): Promise<void> {
  await mkdir(to, { recursive: true });
  await cp(from, to, { recursive: true });
}

/** Replaces or appends a marked block in a text file. Idempotent. */
export async function upsertBlock(
  path: string,
  block: string,
  start: string,
  end: string,
): Promise<'created' | 'updated' | 'unchanged'> {
  const existing = existsSync(path) ? await readFile(path, 'utf8') : null;
  if (existing === null) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, block.trimEnd() + '\n');
    return 'created';
  }
  const re = new RegExp(
    `${start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
  );
  if (re.test(existing)) {
    const next = existing.replace(re, block.trim());
    if (next === existing) return 'unchanged';
    await writeFile(path, next);
    return 'updated';
  }
  await writeFile(path, existing.trimEnd() + '\n\n' + block.trimEnd() + '\n');
  return 'updated';
}
