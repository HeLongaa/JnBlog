"use client";

import { blogConfig } from "@/blog.config";
import { useEffect, useRef } from "react";
// import "artalk/dist/Artalk.css";

interface CommentSectionProps {
  slug: string;
  title: string;
}

export default function CommentSection({ slug, title }: CommentSectionProps) {
  const artalkRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically import Artalk to avoid SSR issues
    const loadArtalk = () => {
      // Load CSS
      const cssId = 'artalk-css';
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = blogConfig.artalk.server + '/dist/Artalk.css';
        document.head.appendChild(link);
      }

      // Load JS
      const scriptId = 'artalk-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = blogConfig.artalk.server + '/dist/Artalk.js';
        script.async = true;
        document.body.appendChild(script);
      }

      // Polling for both Artalk library AND Container readiness
      const checkInterval = setInterval(() => {
        if ((window as any).Artalk && containerRef.current) {
          clearInterval(checkInterval);
          initArtalk();
        }
      }, 100);

      // Stop checking after 10s
      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
      }, 10000);

      // Cleanup polling if component unmounts
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    };

    const initArtalk = () => {
      if (artalkRef.current) {
        artalkRef.current.destroy();
      }

      if ((window as any).Artalk && containerRef.current) {
        const isDark = document.documentElement.classList.contains('dark');
        
        try {
          artalkRef.current = (window as any).Artalk.init({
            el: containerRef.current, // Use ref directly instead of selector
            pageKey: `/post/${slug}`, 
            pageTitle: title,
            server: blogConfig.artalk.server,
            site: blogConfig.artalk.siteId,
            darkMode: isDark,
          });
        } catch (e) {
          console.error("Artalk init failed:", e);
        }

        const updateDarkMode = () => {
           const isDarkMode = document.documentElement.classList.contains('dark');
           artalkRef.current?.setDarkMode(isDarkMode);
        };

        // Listen for custom theme-change event (for immediate updates)
        window.addEventListener('theme-change', updateDarkMode);

        // Fallback: Watch for class changes on html element
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              updateDarkMode();
            }
          });
        });

        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        });

        // Store cleanups
        (artalkRef.current as any)._cleanup = () => {
          window.removeEventListener('theme-change', updateDarkMode);
          observer.disconnect();
        };
      }
    };

    const cleanupLoadListener = loadArtalk();

    return () => {
      if (cleanupLoadListener) cleanupLoadListener();
      
      if (artalkRef.current) {
        if ((artalkRef.current as any)._cleanup) {
          (artalkRef.current as any)._cleanup();
        }
        artalkRef.current.destroy();
        artalkRef.current = null;
      }
    };
  }, [slug, title]);

  return (
    <div id="comments" className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8">
        Comments
      </h3>
      {/* Use ref for the container and add key to force re-render on slug change */}
      <div ref={containerRef} key={slug} className="w-full"></div>
    </div>
  );
}
