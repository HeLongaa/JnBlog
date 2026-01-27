'use client';

import { useEffect } from 'react';
import { useBlogNavigation } from '@/context/BlogNavigationContext';

interface PostNavInfo {
  title: string;
  slug: string;
}

interface BlogNavUpdaterProps {
  currentSlug: string;
  prevPost: PostNavInfo | null;
  nextPost: PostNavInfo | null;
}

export default function BlogNavUpdater({ currentSlug, prevPost, nextPost }: BlogNavUpdaterProps) {
  const { setNavData, clearNavData } = useBlogNavigation();

  useEffect(() => {
    // Update navigation data when mounting
    setNavData({ currentSlug, prev: prevPost, next: nextPost });

    // Clear navigation data when unmounting (only if it matches current slug)
    return () => {
      // Use a timeout to allow the next page to set its data before we clear the old one
      // This prevents flickering if the user navigates quickly between posts
      // However, if we navigate away from blog posts entirely, we want to clear it
      
      // Actually, we don't strictly need to clear it on unmount if we trust the next page to overwrite it.
      // But we do want to clear it if we go to a non-post page.
      
      // Let's rely on the next BlogNavUpdater to overwrite, or DockNav to handle empty state if needed.
      // But we still need to clear if we leave the blog section.
      
      // A safer approach for the infinite loop:
      // Since setNavData and clearNavData are now stable (useCallback), the dependency array won't trigger re-runs
      // unless currentSlug, prevPost, or nextPost changes.
      
      // But just to be safe and avoid "update depth exceeded" if there's some other re-render trigger:
      // clearNavData(currentSlug); 
      // ^ This is fine now with useCallback.
      
      // BUT, if clearNavData causes a re-render of BlogNavUpdater (via context update),
      // and BlogNavUpdater unmounts/remounts for some reason, we could still have issues.
      // In this case, BlogNavUpdater is inside the page, so it mounts/unmounts on navigation.
      
      clearNavData(currentSlug);
    };
  }, [currentSlug, prevPost?.slug, nextPost?.slug, setNavData, clearNavData]); // Use primitive values for deps where possible

  return null; // This component renders nothing
}
