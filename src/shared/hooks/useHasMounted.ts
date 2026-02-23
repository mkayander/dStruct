import { useSyncExternalStore } from "react";

let clientMounted = false;
let scheduleScheduled = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!clientMounted && !scheduleScheduled) {
    scheduleScheduled = true;
    setTimeout(() => {
      clientMounted = true;
      scheduleScheduled = false;
      listeners.forEach((l) => l());
    }, 0);
  }
  return () => listeners.delete(listener);
}

function getSnapshot(): boolean {
  return clientMounted;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Returns true only after the component has mounted (client-side).
 * Use to defer rendering of content that must not be server-rendered
 * (e.g. to avoid hydration mismatch when SSR and client render order differs).
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
