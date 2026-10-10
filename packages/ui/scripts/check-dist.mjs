// Post-build checks (DECISIONS.md #14, #11):
// 1. Every source file that starts with "use client" keeps the directive in dist.
// 2. dist/styles.css contains no raw colour literals; every colour is a var(--macaw-…).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const failures = [];
for (const src of walk('src').filter(
  (f) => /\.tsx?$/.test(f) && !/\.test\.|\.examples\./.test(f),
)) {
  const text = readFileSync(src, 'utf8');
  if (!/^\s*['"]use client['"]/.test(text)) continue;
  const out = join('dist', relative('src', src).replace(/\.tsx?$/, '.js'));
  let built;
  try {
    built = readFileSync(out, 'utf8');
  } catch {
    failures.push(`${src}: expected ${out} to exist`);
    continue;
  }
  if (!/^\s*['"]use client['"]/.test(built))
    failures.push(`${src}: "use client" directive lost in ${out}`);
}

// Ignore Tailwind's own internals (the @layer properties feature probe, @property defaults) and
// `#0000`, which is how Tailwind spells `transparent`.
const css = readFileSync('dist/styles.css', 'utf8')
  .replace(/@layer properties\{[\s\S]*?\}\}\}/g, '')
  .replace(/@property[^{]*\{[^}]*\}/g, '')
  .replace(/#0000\b/g, '');
const raw = css.match(/#[0-9a-f]{3,8}\b|\b(?:rgb|hsl|oklch|oklab)\(/gi);
if (raw)
  failures.push(`dist/styles.css contains raw colour literals: ${[...new Set(raw)].join(', ')}`);

if (failures.length) {
  console.error('check-dist failed:\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log('check-dist: ok');
