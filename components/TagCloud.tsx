"use client";

import { Tag as TagIcon } from "lucide-react";

interface TagCloudProps {
  tags: string[];
  counts: Record<string, number>;
}

export default function TagCloud({ tags, counts }: TagCloudProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, tag: string) => {
    e.preventDefault();
    const element = document.getElementById(tag);
    if (element) {
      // Offset for fixed header (approx 100px)
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-20">
      {tags.map(tag => (
        <a
          key={tag}
          href={`#${tag}`}
          onClick={(e) => handleClick(e, tag)}
          className="group flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-5 py-2 text-slate-600 dark:text-slate-300 hover:border-teal-500 dark:hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 hover:shadow-md transition-all no-underline cursor-pointer"
        >
          <TagIcon size={14} className="mr-2 text-slate-400 dark:text-slate-500 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors" />
          <span className="font-medium mr-2">{tag}</span>
          <span className="text-slate-400 dark:text-slate-500 text-sm group-hover:text-teal-400">| {counts[tag]}</span>
        </a>
      ))}
    </div>
  );
}
