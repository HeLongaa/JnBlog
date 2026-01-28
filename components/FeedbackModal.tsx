'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bug, Info, ChevronLeft, Send, Smartphone, MapPin, FileText, Link as LinkIcon, ShieldAlert, Lock } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'menu' | 'bug' | 'about';

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [view, setView] = useState<ViewState>('menu');
  const router = useRouter();

  // Reset view when closing
  React.useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setView('menu'), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmitBug = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const location = formData.get('location') as string;
    const device = formData.get('device') as string;
    const email = formData.get('email') as string;
    const description = formData.get('description') as string;

    const subject = encodeURIComponent('Bug Report from JnBlog');
    const body = encodeURIComponent(`
Location/Page: ${location}
Device/Browser: ${device}
Email: ${email}
Description:
${description}
    `.trim());

    window.location.href = `mailto:helongaa@yeah.net?subject=${subject}&body=${body}`;
    onClose();
  };

  const menuVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-100"
          />

          {/* Modal */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 350,
              mass: 0.5
            }}
            style={{
              willChange: "transform, opacity, height"
            }}
            className="fixed bottom-24 left-0 right-0 mx-auto w-[90vw] max-w-md bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-300 dark:border-white/10 rounded-2xl z-101 overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/50 origin-bottom"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2">
                {view !== 'menu' && (
                  <button
                    onClick={() => setView('menu')}
                    className="p-1 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {view === 'menu' && 'Feedback Center'}
                  {view === 'bug' && 'Report a Bug'}
                  {view === 'about' && 'About Blog'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <motion.div
              layout
              className="px-6 overflow-hidden"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {view === 'menu' && (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-4 py-6"
                  >
                    <button
                      onClick={() => setView('bug')}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 transition-all text-left group"
                    >
                      <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                        <Bug size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">Report a Bug</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Found something broken? Let me know.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setView('about')}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 transition-all text-left group"
                    >
                      <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                        <Info size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">About Blog</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Learn more about this project.</p>
                      </div>
                    </button>
                  </motion.div>
                )}

                {view === 'bug' && (
                  <motion.div
                    key="bug"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="py-6"
                  >
                    <form onSubmit={handleSubmitBug} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <MapPin size={16} /> Location / Page
                        </label>
                        <input
                          type="text"
                          name="location"
                          placeholder="e.g. Home page, Footer..."
                          className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Smartphone size={16} /> Device / Browser
                        </label>
                        <input
                          type="text"
                          name="device"
                          placeholder="e.g. iPhone 14, Chrome Desktop..."
                          className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                            <rect width="20" height="16" x="2" y="4" rx="2" ry="2"></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                          </svg> Email (Optional)
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="e.g. your@email.com"
                          className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <FileText size={16} /> Description
                        </label>
                        <textarea
                          name="description"
                          placeholder="Describe what happened..."
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Send size={18} /> Submit Report
                      </button>
                    </form>
                  </motion.div>
                )}

                {view === 'about' && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-4 py-6"
                  >
                    <button
                      onClick={() => {
                        onClose();
                        router.push('/info/about-link');
                      }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 transition-all text-left group"
                    >
                      <div className="p-3 rounded-lg bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                        <LinkIcon size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">About Link</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">External link policy</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        router.push('/info/disclaimer');
                      }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 transition-all text-left group"
                    >
                      <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                        <ShieldAlert size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">Disclaimer</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Legal disclaimer</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        router.push('/info/privacy');
                      }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 transition-all text-left group"
                    >
                      <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <Lock size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">Privacy Policy</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Data privacy information</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
