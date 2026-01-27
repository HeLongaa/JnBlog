"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface DockItemProps {
  children: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  isActive?: boolean;
}

export default function DockItem({ children, label, onClick, className, isActive }: DockItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        left: rect.left + rect.width / 2,
        top: rect.top
      });
    }
    setIsHovered(true);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "w-10 h-10 p-2.5 mx-1 rounded-full transition-all active:scale-95 relative flex items-center justify-center outline-none",
          isActive 
            ? "text-teal-600 dark:text-teal-400 bg-slate-100 dark:bg-white/10" 
            : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-white/10",
          className
        )}
        aria-label={label}
      >
        {children}
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
              animate={{ opacity: 1, y: -12, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 2, scale: 0.9, x: "-50%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ 
                position: "fixed", 
                left: coords.left, 
                top: coords.top,
                zIndex: 100 
              }}
              className="px-3 py-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-900 dark:text-slate-100 text-xs font-medium rounded-lg shadow-xl border border-slate-200 dark:border-white/10 whitespace-nowrap pointer-events-none -translate-y-full"
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
