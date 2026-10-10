# Shared helpers for MACAW hooks. Sourced, not executed.
macaw_json_field() {
  # usage: printf '%s' "$INPUT" | macaw_json_field '.tool_input.file_path'
  node -e '
    let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
      try {
        const path = process.argv[1].replace(/^\./, "").split(".");
        let v = JSON.parse(s);
        for (const k of path) v = v?.[k];
        process.stdout.write(v === undefined || v === null ? "" : String(v));
      } catch { process.stdout.write(""); }
    });' "$1"
}
macaw_pm_exec() {
  # Runs a package binary with whichever package manager the repo uses.
  if [ -f pnpm-lock.yaml ]; then pnpm exec "$@";
  elif [ -f yarn.lock ]; then yarn "$@";
  elif [ -f bun.lockb ] || [ -f bun.lock ]; then bunx "$@";
  else npx --no-install "$@"; fi
}
macaw_pm_run() {
  if [ -f pnpm-lock.yaml ]; then pnpm run --if-present "$@";
  elif [ -f yarn.lock ]; then yarn run "$@";
  elif [ -f bun.lockb ] || [ -f bun.lock ]; then bun run "$@";
  else npm run --if-present "$@"; fi
}
