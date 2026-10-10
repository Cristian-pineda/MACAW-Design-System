import type { Linter } from 'eslint';

export interface MacawOptions {
  /** Path to the CSS entry that imports the MACAW theme; enables Tailwind-aware rules. */
  tailwindEntry?: string;
  /** True inside the MACAW monorepo. Consumers leave it false. */
  system?: boolean;
  /** Globs to lint. Defaults to TS/JS/JSX. */
  files?: string[];
}

export declare const macawPlugin: {
  meta: { name: string; version: string };
  rules: Record<string, unknown>;
};

/** Flat config factory: `export default [...macaw({ tailwindEntry: 'app/globals.css' })]`. */
export default function macaw(options?: MacawOptions): Linter.Config[];
