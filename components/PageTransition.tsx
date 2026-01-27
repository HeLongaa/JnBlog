"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";

const pages = ["/", "/about", "/blog", "/projects", "/links", "/tags"];

// Track previous path using ref instead of global object

function getPageIndex(pathname: string) {
  // Check exact match first
  let index = pages.indexOf(pathname);
  if (index !== -1) return index;

  // Check starts with for nested routes (e.g. /blog/slug)
  if (pathname.startsWith("/blog/")) return 2.1; 
  
  return -1;
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Check if we are navigating between blog posts
  const isBlogPost = (path: string) => {
    if (!path) return false;
    // Remove query params and trailing slash for consistent matching
    const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/';
    return cleanPath.startsWith("/blog/") && cleanPath !== "/blog";
  };
  const isPostTransition = isBlogPost(pathname) && isBlogPost(prevPathname.current);

  const getDirection = () => {
    // If navigating between posts, we use a special "0" direction which we'll map to fade
    if (isPostTransition) return 0;

    let current = getPageIndex(pathname);
    let prev = getPageIndex(prevPathname.current);

    // Handle unknown pages (fallback)
    if (current === -1) current = 99;
    if (prev === -1) prev = 99;

    if (current > prev) return 1; // Slide Left (New enters from Right)
    if (current < prev) return -1; // Slide Right (New enters from Left)
    return 0;
  };

  const direction = getDirection();
  
  // Update ref AFTER render using useEffect to avoid mutation during render
  // This ensures the current render uses the old value, and subsequent renders use the new value
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      // Force scroll to top on page change
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      prevPathname.current = pathname;
    }
  }, [pathname]);

  const variants = {
    enter: (direction: number) => {
      // If direction is 0 (Post <-> Post or same level), just fade
      if (direction === 0) {
        return { opacity: 0, x: 0 };
      }
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      // If direction is 0 (Post <-> Post or same level), just fade
      if (direction === 0) {
        return { opacity: 0, x: 0, height: "100%", overflow: "hidden" };
      }
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        height: "100%",
        overflow: "hidden"
      };
    },
  };

  return (
    <div className="relative w-full grow flex flex-col overflow-hidden">
      <AnimatePresence mode="popLayout" custom={direction} initial={false}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: direction === 0 ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
            height: { duration: 0 } // Snap height immediately on exit
          }}
          className="w-full grow flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
