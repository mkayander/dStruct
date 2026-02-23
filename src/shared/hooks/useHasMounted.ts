import { useEffect, useState } from "react";

/**
 * Returns true only after the component has mounted (client-side).
 * Use to defer rendering of content that must not be server-rendered
 * (e.g. to avoid hydration mismatch when SSR and client render order differs).
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
