'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** false during SSR and hydration, true after mount. Use before reading browser-only state (theme, storage) so hydration matches the server. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
