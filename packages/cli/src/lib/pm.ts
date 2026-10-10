import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

export type PackageManager = 'pnpm' | 'yarn' | 'bun' | 'npm';

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(`${cwd}/pnpm-lock.yaml`)) return 'pnpm';
  if (existsSync(`${cwd}/yarn.lock`)) return 'yarn';
  if (existsSync(`${cwd}/bun.lockb`) || existsSync(`${cwd}/bun.lock`)) return 'bun';
  const ua = process.env.npm_config_user_agent ?? '';
  if (ua.startsWith('pnpm')) return 'pnpm';
  if (ua.startsWith('yarn')) return 'yarn';
  if (ua.startsWith('bun')) return 'bun';
  return 'npm';
}

export function addCommand(pm: PackageManager, pkgs: string[], dev = false): string[] {
  switch (pm) {
    case 'pnpm':
      return ['pnpm', 'add', ...(dev ? ['-D'] : []), ...pkgs];
    case 'yarn':
      return ['yarn', 'add', ...(dev ? ['-D'] : []), ...pkgs];
    case 'bun':
      return ['bun', 'add', ...(dev ? ['-d'] : []), ...pkgs];
    default:
      return ['npm', 'install', ...(dev ? ['-D'] : []), ...pkgs];
  }
}

export function run(cmd: string[], cwd: string): void {
  const [bin, ...args] = cmd;
  const res = spawnSync(bin as string, args, { cwd, stdio: 'inherit' });
  if (res.status !== 0)
    throw new Error(`${cmd.join(' ')} failed with exit code ${res.status ?? 'unknown'}`);
}

export function runScript(pm: PackageManager, script: string): string {
  return pm === 'npm' ? `npm run ${script}` : `${pm} ${script}`;
}
