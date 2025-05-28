'use client';

import { useState, useEffect } from 'react';

export function useIsMobile(query: string = '(max-width: 768px)'): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    // Initial check
    handleChange();

    // Listen for changes
    try {
        mediaQuery.addEventListener('change', handleChange);
    } catch (e) {
        // Safari < 14 uses deprecated addListener
        mediaQuery.addListener(handleChange);
    }

    return () => {
        try {
            mediaQuery.removeEventListener('change', handleChange);
        } catch (e) {
            // Safari < 14 uses deprecated removeListener
            mediaQuery.removeListener(handleChange);
        }
    };
  }, [query]);

  return isMobile;
} 