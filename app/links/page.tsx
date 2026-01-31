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
    <div className="text-center mb-16">
      <h1 className="text-5xl font-extrabold text-teal-800 dark:text-teal-400 mb-6 tracking-tight" {...props} />
      <p className="text-slate-600 dark:text-slate-400 text-xl font-medium">友情链接</p>
    </div>
  ),
  blockquote: (props: any) => (
    <div className="bg-slate-50 dark:bg-slate-900 py-3 px-4 rounded-sm my-4 text-slate-700 dark:text-slate-300 leading-relaxed font-serif not-italic">
      {props.children}
    </div>
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-12 mb-6 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center before:content-['##'] before:text-teal-500 before:mr-2" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4 flex items-center before:content-['###'] before:text-teal-500 before:mr-2" {...props} />
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

    return <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed" {...props} />;
  },
  a: (props: any) => (
    <Link href={props.href} className="text-teal-700 dark:text-teal-400 font-bold no-underline" {...props} />
  ),
  strong: (props: any) => (
    <strong className="font-bold text-slate-900 dark:text-slate-100" {...props} />
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
  pre: CodeBlock,
  img: ImageLightbox,
};

export default async function LinksPage() {
  const filePath = path.join(process.cwd(), 'content', 'links.md');
  const source = fs.readFileSync(filePath, 'utf8');

  return (
    <main className="flex-grow container mx-auto px-4 max-w-4xl py-10">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <MDXRemote source={source} components={components} />
      </article>
    </main>
  );
}
