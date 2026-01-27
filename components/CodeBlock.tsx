'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check, Copy, Terminal, FileCode, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
}

const MAX_LINES_COLLAPSED = 40;

export default function CodeBlock({ children, ...props }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCollapseButton, setShowCollapseButton] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const codeContentRef = useRef<string>('');

  // Extract language and content
  let language = '';
  let codeContent = '';
  
  if (React.isValidElement(children)) {
    // @ts-ignore
    const className = children.props?.className || '';
    const match = /language-(\w+)/.exec(className);
    if (match) {
      language = match[1];
    }
    // @ts-ignore
    codeContent = children.props?.children || '';
    
    // Remove leading newline if present to prevent empty first line
    if (typeof codeContent === 'string' && codeContent.startsWith('\n')) {
      codeContent = codeContent.substring(1);
    }

    codeContentRef.current = String(codeContent);
  }

  // Calculate lines and set initial collapsed state
  useEffect(() => {
    if (codeContentRef.current) {
      const lineCount = codeContentRef.current.split('\n').length;
      if (lineCount > MAX_LINES_COLLAPSED) {
        setShowCollapseButton(true);
        setIsCollapsed(true);
      }
    }
  }, []);

  const copyToClipboard = async () => {
    try {
      // Check if clipboard API is supported
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(codeContentRef.current);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        // Fallback to execCommand if clipboard API is not supported
        const textArea = document.createElement('textarea');
        textArea.value = codeContentRef.current;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (execErr) {
          // Silently handle execCommand error
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      // Silently handle any other errors
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Generate line numbers
  const lines = codeContentRef.current.split('\n');
  // Remove the last empty line if it exists (common in code blocks)
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  const displayedLines = isCollapsed ? lines.slice(0, MAX_LINES_COLLAPSED) : lines;

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-sm">
      {/* Header with Language and Copy Button */}
      <div className="flex items-center justify-between px-5 py-2 bg-slate-200/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs select-none backdrop-blur-sm">
        <div className="flex items-center gap-2">
           {language ? (
             <span className="flex items-center gap-1.5 font-mono font-semibold uppercase text-teal-600 dark:text-teal-500/80">
               <Terminal size={12} />
               {language}
             </span>
           ) : (
             <span className="flex items-center gap-1.5 font-mono font-semibold text-slate-500">
               <FileCode size={12} />
               TEXT
             </span>
           )}
           <span className="text-slate-400 dark:text-slate-600">|</span>
           <span className="text-slate-500">{lines.length} lines</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors focus:outline-none bg-slate-200/50 dark:bg-white/5 hover:bg-slate-300/50 dark:hover:bg-white/10 px-2 py-1 rounded-md"
          aria-label="Copy code"
        >
          {isCopied ? (
            <>
              <Check size={12} className="text-teal-600 dark:text-teal-500" />
              <span className="text-teal-600 dark:text-teal-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span className="font-medium">Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code Content with Line Numbers */}
      <div className="relative overflow-x-auto bg-slate-50 dark:bg-slate-950">
        <div className="flex min-w-full">
          {/* Line Numbers */}
          <pre 
            className="text-right select-none bg-slate-100 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 py-4 px-3 sm:px-4 text-slate-400 dark:text-slate-600 font-mono text-sm leading-relaxed sticky left-0 z-10 m-0!"
            style={{ minHeight: '100%' }}
          >
            {displayedLines.map((_, i) => i + 1).join('\n')}
            {isCollapsed && <span className="opacity-50">{'\n...'}</span>}
          </pre>
          
          {/* Code */}
          <pre 
              ref={preRef}
              className="flex-1 py-4 px-5 sm:px-6 text-sm font-mono leading-relaxed text-slate-800 dark:text-slate-100 bg-transparent border-0 m-0! overflow-visible"
              {...props}
          >
              <code className={children && React.isValidElement(children) ? (children.props as any).className : ''}>
                {displayedLines.join('\n')}
              </code>
          </pre>
        </div>
        
        {/* Collapse Button Overlay */}
        {showCollapseButton && (
          <div className={`absolute bottom-0 left-0 right-0 flex justify-center pt-8 pb-2 bg-linear-to-t from-slate-100 dark:from-slate-950 to-transparent ${!isCollapsed ? 'pointer-events-none opacity-0' : 'pointer-events-auto'}`}>
             {isCollapsed && (
                <button 
                  onClick={toggleCollapse}
                  className="flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 shadow-sm hover:shadow-md transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <ChevronDown size={14} />
                  Show all {lines.length} lines
                </button>
             )}
          </div>
        )}
      </div>

      {/* Expand/Collapse Footer (only visible when expanded) */}
      {showCollapseButton && !isCollapsed && (
         <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 py-1 flex justify-center">
            <button 
              onClick={toggleCollapse}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors py-1 px-4 w-full justify-center"
            >
              <ChevronUp size={14} />
              Collapse code
            </button>
         </div>
      )}
    </div>
  );
}
