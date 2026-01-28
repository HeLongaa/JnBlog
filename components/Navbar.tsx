"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { blogConfig } from '@/blog.config';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isBlogPost = pathname.startsWith('/blog/') && pathname !== '/blog';
  const isInfoPage = pathname.startsWith('/info/');

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/projects', label: 'Projects' },
    { href: '/links', label: 'Links' },
  ];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="py-6 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-transparent">
        <div className="container mx-auto px-4 max-w-4xl flex justify-between items-center">
          {isBlogPost ? (
            <Link href="/blog" className="text-xl font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors z-50 relative">
              ← Back to Blog
            </Link>
          ) : isInfoPage ? (
            <button
              onClick={() => router.back()}
              className="text-xl font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors z-50 relative"
            >
              ← Back
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors z-50 relative">
              <img src="/icon.png" alt="Logo" className="w-8 h-8" />
              {blogConfig.title}
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden min-[520px]:block">
            <ul className="flex space-x-4 relative">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);

                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative font-bold text-lg px-4 py-2 inline-block transition-colors rounded-xl",
                        isActive
                          ? "text-teal-700 dark:text-teal-300"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      )}
                    >
                      <AnimatePresence mode="popLayout">
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-white/40 dark:bg-white/10 shadow-sm border border-white/20 dark:border-white/5 rounded-xl -z-10"
                          />
                        )}
                      </AnimatePresence>
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="min-[520px]:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay - Moved outside header to avoid backdrop-filter clipping */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 min-[520px]:hidden"
            />
            <motion.div
              initial={{ x: "100%", y: "-50%", opacity: 0 }}
              animate={{ x: 0, y: "-50%", opacity: 1 }}
              exit={{ x: "100%", y: "-50%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-1/2 right-4 w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 z-50 min-[520px]:hidden shadow-2xl border border-white/20 dark:border-white/10 rounded-2xl overflow-hidden"
            >
              <ul className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);

                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={cn(
                          "block font-bold text-lg px-4 py-3 transition-colors rounded-xl",
                          isActive
                            ? "text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30"
                            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
