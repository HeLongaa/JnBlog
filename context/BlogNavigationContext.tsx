'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface PostNavInfo {
  title: string;
  slug: string;
}

interface BlogNavigationContextType {
  navData: {
    currentSlug: string | null;
    prev: PostNavInfo | null;
    next: PostNavInfo | null;
  };
  setNavData: (data: { currentSlug: string | null; prev: PostNavInfo | null; next: PostNavInfo | null }) => void;
  clearNavData: (slug: string) => void;
}

const BlogNavigationContext = createContext<BlogNavigationContextType | undefined>(undefined);

export function BlogNavigationProvider({ children }: { children: React.ReactNode }) {
  const [navData, setNavDataState] = useState<{ currentSlug: string | null; prev: PostNavInfo | null; next: PostNavInfo | null }>({
    currentSlug: null,
    prev: null,
    next: null,
  });

  const setNavData = useCallback((data: { currentSlug: string | null; prev: PostNavInfo | null; next: PostNavInfo | null }) => {
    setNavDataState(data);
  }, []);

  const clearNavData = useCallback((slug: string) => {
    setNavDataState((current) => {
      // Only clear if the current data belongs to the slug being cleared
      if (current.currentSlug === slug) {
        return { currentSlug: null, prev: null, next: null };
      }
      return current;
    });
  }, []);

  const value = useMemo(() => ({
    navData,
    setNavData,
    clearNavData
  }), [navData, setNavData, clearNavData]);

  return (
    <BlogNavigationContext.Provider value={value}>
      {children}
    </BlogNavigationContext.Provider>
  );
}

export function useBlogNavigation() {
  const context = useContext(BlogNavigationContext);
  if (context === undefined) {
    throw new Error('useBlogNavigation must be used within a BlogNavigationProvider');
  }
  return context;
}
