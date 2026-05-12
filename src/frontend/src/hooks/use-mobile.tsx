import { useEffect, useState } from "react";

/**
 * Optimized hook to detect mobile viewport.
 * Uses matchMedia for better performance over 'resize' listeners.
 */
export function useIsMobile(breakpoint = 768): boolean {
  // Initialize with null or a sensible default to handle SSR environments
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (SSR safety)
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    
    // Initial check
    setIsMobile(mql.matches);

    // Optimized listener: only fires when crossing the breakpoint
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Support for both modern and older browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      mql.addListener(onChange);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        mql.removeListener(onChange);
      }
    };
  }, [breakpoint]);

  return isMobile;
}
