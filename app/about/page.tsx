import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import React from 'react';
import CodeBlock from "@/components/CodeBlock";
import ImageLightbox from "@/components/ImageLightbox";

// Custom MDX components to match the styling
const components = {
  h1: (props: any) => (
    <h1 className="text-5xl font-extrabold text-teal-800 dark:text-teal-400 text-center mb-12 tracking-tight" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-12 mb-6 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center before:content-['##'] before:text-teal-500 before:mr-2" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4 flex items-center before:content-['###'] before:text-teal-500 before:mr-2" {...props} />
  ),
  blockquote: (props: any) => (
    <div className="bg-slate-50 dark:bg-slate-900 py-3 px-4 rounded-md my-4 text-slate-700 dark:text-slate-300 leading-relaxed font-serif not-italic">
        {props.children}
    </div>
  ),
  p: (props: any) => {
    // Check if the paragraph contains an ImageLightbox (which is a div)
    const children = React.Children.toArray(props.children);
    const hasImage = children.some((child: any) => 
      child?.type === ImageLightbox || 
      child?.props?.mdxType === 'img' || 
      (child?.props && typeof child.props === 'object' && 'src' in child.props && 'alt' in child.props)
    );

    if (hasImage) {
      return <>{props.children}</>;
    }

    return <p className="mb-4 text-slate-700 dark:text-slate-300" {...props} />;
  },
  a: (props: any) => {
    // Check if it's the "支持我 ->" link which should be teal and bold
    if (props.children && typeof props.children === 'string' && props.children.includes('支持我')) {
        return <Link href={props.href} className="text-teal-700 dark:text-teal-400 font-bold inline-block mt-4 no-underline" {...props} />
    }
    // Default link style (e.g. for Twitter/Telegram) with icon indicator
    return (
      <a className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-medium inline-flex items-center no-underline" target="_blank" rel="noopener noreferrer" {...props}>
        {props.children}
        <span className="ml-1 text-xs">↗</span>
      </a>
    );
  },
  ul: (props: any) => (
    <ul className="space-y-3 list-none pl-0" {...props} />
  ),
  li: (props: any) => (
    <li className="flex items-center text-slate-600 dark:text-slate-400" {...props}>
        <span className="mr-2 text-slate-300 dark:text-slate-600">•</span>
        {props.children}
    </li>
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-8 border border-slate-200 dark:border-slate-700 rounded-lg">
      <table className="min-w-full text-left text-sm" {...props} />
    </div>
  ),
  thead: (props: any) => (
    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 font-semibold" {...props} />
  ),
  tbody: (props: any) => (
    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900/20" {...props} />
  ),
  tr: (props: any) => (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors" {...props} />
  ),
  th: (props: any) => (
    <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap" {...props} />
  ),
  td: (props: any) => (
    <td className="px-6 py-4 text-slate-600 dark:text-slate-300" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-sm font-mono mx-1 before:content-none after:content-none" {...props} />
  ),
  pre: CodeBlock,
  img: ImageLightbox,
};

export default async function AboutPage() {
  const filePath = path.join(process.cwd(), 'content', 'about.md');
  const source = fs.readFileSync(filePath, 'utf8');

  return (
    <main className="flex-grow container mx-auto px-4 max-w-4xl py-10">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <MDXRemote source={source} components={components} />
      </article>
    </main>
  );
}
