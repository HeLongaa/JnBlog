"use client";

import { useEffect, useState, useRef } from "react";
import { MessageCircleQuestion, Moon, Sun, ArrowUp, X, Sparkles, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import DockItem from "./DockItem";
import { useLightbox } from "@/context/LightboxContext";
import FeedbackModal from "./FeedbackModal";

export default function FloatingDock() {
  const pathname = usePathname();
  const [showBackTopBtn, setShowBackTopBtn] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isOpen: isLightboxOpen, closeImage } = useLightbox();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Determine if we are on an article page (starts with /blog/ but is not the list page /blog)
  const isArticlePage = pathname?.startsWith('/blog/') && pathname !== '/blog';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    // Measure Dock width
    const dockElement = document.getElementById('floating-dock');
    if (dockElement) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Set CSS variable for external components to use
          document.documentElement.style.setProperty('--dock-width', `${entry.contentRect.width}px`);
          document.documentElement.style.setProperty('--dock-nav-opacity', '1');
        }
      });
      observer.observe(dockElement);
      return () => observer.disconnect();
    }
  }, [showBackTopBtn, isLightboxOpen]); // Re-measure when buttons change

  useEffect(() => {
    setMounted(true);
    // Check initial theme
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }

    // Scroll listener for Back to Top button
    const handleScroll = () => {
      setShowBackTopBtn(window.scrollY > 300);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Check if View Transition API is supported
    // @ts-ignore
    if (!document.startViewTransition) {
      toggleThemeLogic();
      return;
    }

    // Check if View Transitions API is supported before using it
    const supportsViewTransitions = typeof document !== 'undefined' && 'startViewTransition' in document;

    if (supportsViewTransitions) {
      const x = e.clientX;
      const y = e.clientY;
      const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
      );

      try {
        // @ts-ignore
        const transition = document.startViewTransition(() => {
          toggleThemeLogic();
        });

        if (transition && transition.ready) {
          transition.ready.then(() => {
            try {
              const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ];

              document.documentElement.animate(
                {
                  clipPath: clipPath,
                },
                {
                  duration: 500,
                  easing: "ease-in-out",
                  pseudoElement: "::view-transition-new(root)",
                }
              );
            } catch (animateError) {
              // Silently handle animation errors
            }
          }).catch((readyError) => {
            // Silently handle ready promise errors
          });
        }
      } catch (startTransitionError) {
        // Silently handle startViewTransition errors
        toggleThemeLogic();
      }
    } else {
      // Fallback to direct theme toggle if View Transitions API is not supported
      toggleThemeLogic();
    }
  };

  const toggleThemeLogic = () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
    // Dispatch a custom event to notify other components (like Artalk) immediately
    window.dispatchEvent(new Event('theme-change'));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div
        id="floating-dock"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-2xl ${isLightboxOpen ? 'aspect-square' : ''}`}
        style={{ zIndex: isLightboxOpen ? 110 : 50 }}
      >
        {/* Portal Slot for Dynamic Buttons - Always rendered but hidden when lightbox is open */}
        <div id="dock-portal-start" className={`flex items-center ${isLightboxOpen ? 'hidden' : ''}`} />

        {isLightboxOpen ? (
          <DockItem
            label="Close Lightbox"
            onClick={closeImage}
            className="m-0"
          >
            <X size={20} />
          </DockItem>
        ) : (
          <>
            {/* AI Assistant Button */}
            <DockItem
              label="AI Assistant"
              onClick={() => alert("AI Assistant is coming soon!")}
              className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <Sparkles size={20} />
              </motion.div>
            </DockItem>

            {isArticlePage ? (
              <>
                {/* Separator */}
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1.5 flex-shrink-0" />

                {/* Menu Container */}
                <div className="relative" ref={menuRef}>
                  {/* Menu Toggle */}
                  <DockItem
                    label={isMenuOpen ? "Close Menu" : "More Actions"}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    isActive={isMenuOpen}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isMenuOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X size={20} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <MoreHorizontal size={20} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </DockItem>

                  {/* Expandable Menu Items (Vertical) */}
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex flex-col items-center p-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-2xl z-50"
                      >
                        {/* Feedback Button */}
                        <DockItem
                          label="Feedback"
                          onClick={() => setIsFeedbackOpen(true)}
                          isActive={isFeedbackOpen}
                          className="shadow-none m-0 mb-2 last:mb-0"
                        >
                          <MessageCircleQuestion size={20} />
                        </DockItem>

                        {/* Theme Toggle */}
                        <DockItem
                          label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                          onClick={toggleTheme as any}
                          className="m-0"
                        >
                          {mounted && (isDark ? <Sun size={20} /> : <Moon size={20} />)}
                          {!mounted && <Moon size={20} />}
                        </DockItem>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                {/* Feedback Button */}
                <DockItem
                  label="Feedback"
                  onClick={() => setIsFeedbackOpen(true)}
                  isActive={isFeedbackOpen}
                  className="shadow-none"
                >
                  <MessageCircleQuestion size={20} />
                </DockItem>

                {/* Separator */}
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1.5 flex-shrink-0" />

                {/* Theme Toggle */}
                <DockItem
                  label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  onClick={toggleTheme as any}
                >
                  {mounted && (isDark ? <Sun size={20} /> : <Moon size={20} />)}
                  {!mounted && <Moon size={20} />}
                </DockItem>
              </>
            )}

            {/* Back to Top */}
            <motion.div
              initial={{ width: 0, opacity: 0, margin: 0 }}
              animate={{
                width: showBackTopBtn ? 44 : 0,
                opacity: showBackTopBtn ? 1 : 0,
                margin: showBackTopBtn ? "0 2px" : 0
              }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="overflow-hidden h-11 flex items-center justify-center"
            >
              <DockItem
                label="Back to Top"
                onClick={scrollToTop}
                className="mx-0"
              >
                <ArrowUp size={20} />
              </DockItem>
            </motion.div>
          </>
        )}
      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
}
