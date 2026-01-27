'use client';

import { ArrowLeft, ArrowRight } from "lucide-react";
import DockItem from "./DockItem";
import { useRouter } from "next/navigation";
import { useBlogNavigation } from "@/context/BlogNavigationContext";

export default function DockNav() {
  const router = useRouter();
  const { navData } = useBlogNavigation();
  const { prev: prevPost, next: nextPost } = navData;

  // If no navigation data is available (e.g. not on a blog post page), render nothing
  if (!prevPost && !nextPost) return null;

  return (
    <>
      {/* Previous Post Navigation (Floating Left) */}
      {prevPost && (
        <div 
          className="flex fixed bottom-6 z-40 items-center justify-center p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-2xl transition-all group"
          style={{
            left: '50%',
            transform: 'translateX(calc(-50% - var(--dock-width, 0px) / 2 - 30px - 29px))', // Dock width/2 + 30px gap + half self width
            opacity: 'var(--dock-nav-opacity, 0)', // Hide until dock width is measured
            transition: 'opacity 0.2s ease-in'
          }}
        >
          <DockItem
            label={prevPost.title}
            onClick={() => router.push(`/blog/${prevPost.slug}?direction=prev`)}
            className="m-0"
          >
            <ArrowLeft size={20} />
          </DockItem>
        </div>
      )}

      {/* Next Post Navigation (Floating Right) */}
      {nextPost && (
        <div 
          className="flex fixed bottom-6 z-40 items-center justify-center p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-2xl transition-all group"
          style={{
            left: '50%',
            transform: 'translateX(calc(-50% + var(--dock-width, 0px) / 2 + 30px + 29px))', // Dock width/2 + 30px gap + half self width
            opacity: 'var(--dock-nav-opacity, 0)', // Hide until dock width is measured
            transition: 'opacity 0.2s ease-in'
          }}
        >
          <DockItem
            label={nextPost.title}
            onClick={() => router.push(`/blog/${nextPost.slug}?direction=next`)}
            className="m-0"
          >
            <ArrowRight size={20} />
          </DockItem>
        </div>
      )}
    </>
  );
}
