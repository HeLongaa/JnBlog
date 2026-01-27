"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { List, X, AlignRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, usePresence } from "framer-motion";
import { createPortal } from "react-dom";
import DockItem from "./DockItem";
import { useLightbox } from "@/context/LightboxContext";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const pathname = usePathname();
  const [isPresent] = usePresence();
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: isLightboxOpen } = useLightbox();
  
  // Dock states
  const [showCommentsBtn, setShowCommentsBtn] = useState(true);
  const [dockPortal, setDockPortal] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find portal target
    setDockPortal(document.getElementById('dock-portal-start'));
  }, []);

  useEffect(() => {
    // Intersection Observer for Comments Section
    const commentsSection = document.getElementById('comments');
    if (!commentsSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When lightbox is open, we don't want to change the state
        // because it might cause issues when restoring
        if (!isLightboxOpen) {
          setShowCommentsBtn(!entry.isIntersecting);
        }
      },
      { threshold: 0.1 } // Hide when 10% of comments section is visible
    );

    observer.observe(commentsSection);
    return () => observer.disconnect();
  }, [isLightboxOpen, pathname]);

  const scrollToComments = () => {
    const commentsSection = document.getElementById('comments');
    if (commentsSection) {
      const yOffset = -100;
      const y = commentsSection.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setActiveId("");
    
    // Find the article element
    const article = document.querySelector("article");
    if (!article) return;

    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let currentActiveId = "";
    let animationFrameId: number | null = null;

    const updateActiveHeading = () => {
      const elements = article.querySelectorAll("h2, h3");
      let newActiveId = "";
      
      // Find the last heading that's above the fold
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100) {
          newActiveId = element.id;
        }
      });
      
      if (newActiveId !== currentActiveId) {
        currentActiveId = newActiveId;
        setActiveId(newActiveId);
      }
    };

    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(updateActiveHeading);
    };

    const initTOC = () => {
      const elements = article.querySelectorAll("h2, h3");
      const items: TocItem[] = Array.from(elements).map((element) => ({
        id: element.id,
        text: element.textContent || "",
        level: Number(element.tagName.substring(1)),
      }));

      setHeadings(items);
      
      // Initial update
      updateActiveHeading();
      
      // Start listening to scroll events
      window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // Initial setup with a delay to ensure article content is fully rendered
    const initialTimeout = setTimeout(() => {
      initTOC();
    }, 300);

    // Watch for DOM changes in the article (e.g. hydration, content updates)
    mutationObserver = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          shouldUpdate = true;
          break;
        }
      }
      if (shouldUpdate) {
        // Debounce the TOC update to avoid performance issues
        const timeout = setTimeout(() => {
          // Re-initialize TOC
          if (observer) {
            observer.disconnect();
            observer = null;
          }
          // Remove old scroll listener
          window.removeEventListener('scroll', handleScroll);
          // Re-initialize
          initTOC();
        }, 500);
        
        return () => clearTimeout(timeout);
      }
    });

    mutationObserver.observe(article, { childList: true, subtree: true });

    return () => {
      clearTimeout(initialTimeout);
      if (observer) observer.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Offset for fixed navbar
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
      setIsOpen(false);
    }
  };

  if (headings.length === 0) return null;

  const TocList = () => (
    <nav className="space-y-1">
      {headings.map((heading) => (
        <button
          key={heading.id}
          onClick={() => handleClick(heading.id)}
          className={cn(
            "block text-left text-sm transition-all duration-200 w-full py-1",
            heading.level === 3 ? "pl-4" : "",
            activeId === heading.id
              ? "text-teal-600 dark:text-teal-400 font-bold scale-105 origin-left"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          {heading.text}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Floating TOC */}
      <div className="hidden xl:block fixed top-1/2 -translate-y-1/2 left-[calc(50%+460px)] 2xl:left-[calc(50%+480px)] w-64 2xl:w-96 p-4 rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg z-40 max-h-[80vh] overflow-y-auto">
        <h4 className="text-sm font-bold text-teal-800 dark:text-teal-300 mb-3 flex items-center">
          <AlignRight className="mr-2 w-4 h-4" />
          Table of Contents
        </h4>
        <TocList />
      </div>

      {/* Floating Dock Portal Content */}
      {dockPortal && isPresent && !isLightboxOpen && createPortal(
        <div className="flex items-center">
          {/* Mobile TOC Button */}
          <div className="xl:hidden flex">
            <DockItem
              label="Table of Contents"
              onClick={() => setIsOpen(!isOpen)}
              isActive={isOpen}
            >
              <List size={20} />
            </DockItem>
          </div>

          {/* Jump to Comments */}
          <AnimatePresence>
            {showCommentsBtn && (
              <motion.div
                initial={{ width: 0, opacity: 0, margin: 0 }}
                animate={{ width: 44, opacity: 1, margin: "0 2px" }}
                exit={{ width: 0, opacity: 0, margin: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="overflow-hidden h-11 flex items-center justify-center"
              >
                <DockItem
                  label="Comments"
                  onClick={scrollToComments}
                  className="mx-0"
                >
                  <MessageSquare size={20} />
                </DockItem>
              </motion.div>
            )}
          </AnimatePresence>
        </div>,
        dockPortal
      )}

      {/* Mobile Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 xl:hidden"
            />
            <motion.div
              initial={{ x: "100%", y: "-50%", opacity: 0 }}
              animate={{ x: 0, y: "-50%", opacity: 1 }}
              exit={{ x: "100%", y: "-50%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-1/2 right-4 w-80 max-w-[85vw] max-h-[80vh] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 z-50 xl:hidden shadow-2xl border border-white/20 dark:border-white/10 rounded-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 flex items-center">
                  <AlignRight className="mr-2 w-5 h-5" />
                  Table of Contents
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-white/50 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <TocList />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
