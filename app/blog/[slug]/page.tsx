import { getPostBySlug, getAllPosts, getAdjacentPosts } from "@/lib/posts";
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from "next/navigation";
import Link from "next/link";
import React from 'react';
import { Tag as TagIcon, ArrowLeft, ArrowRight } from "lucide-react";
import rehypeSlug from "rehype-slug";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import TableOfContents from "@/components/TableOfContents";
import CommentSection from "@/components/CommentSection";
import CodeBlock from "@/components/CodeBlock";
import ImageLightbox from "@/components/ImageLightbox";
import DockItem from "@/components/DockItem";
import BlogNavUpdater from "@/components/BlogNavUpdater";

// Reuse the same components from About page for consistency
const components = {
  h1: (props: any) => (
    <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-400 mb-8" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-12 mb-6 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center before:content-['##'] before:text-teal-500 before:mr-2" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4 flex items-center before:content-['###'] before:text-teal-500 before:mr-2" {...props} />
  ),
  blockquote: (props: any) => (
    <div className="bg-slate-50 dark:bg-slate-900 py-3 px-4 rounded-md my-4 text-slate-700 dark:text-slate-300 leading-relaxed font-serif not-italic border-l-4 border-teal-500">
      {props.children}
    </div>
  ),
  p: (props: any) => {
    // Check if the paragraph contains an ImageLightbox (which is a div)
    // If children is an object (React element) and has type ImageLightbox or img, render it directly without p wrapper
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
    <a className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-medium inline-flex items-center no-underline" target="_blank" rel="noopener noreferrer" {...props}>
      {props.children}
    </a>
  ),
  ul: (props: any) => (
    <ul className="space-y-2 list-disc pl-5 mb-6 text-slate-700 dark:text-slate-300" {...props} />
  ),
  ol: (props: any) => (
    <ol className="space-y-2 list-decimal pl-5 mb-6 text-slate-700 dark:text-slate-300" {...props} />
  ),
  li: (props: any) => (
    <li className="pl-1" {...props} />
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
    <code className="bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded text-sm font-mono mx-1 before:content-none after:content-none" {...props} />
  ),
  pre: CodeBlock,
  img: ImageLightbox,
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.content.slice(0, 160).replace(/[#*`]/g, '') + '...',
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160).replace(/[#*`]/g, '') + '...',
      type: 'article',
      publishedTime: post.date,
      authors: ['HeLong'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content.slice(0, 160).replace(/[#*`]/g, '') + '...',
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const adjacentPosts = getAdjacentPosts(slug);

  return (
    <main className="grow container mx-auto px-4 max-w-4xl py-10 relative">
      <TableOfContents />

      <BlogNavUpdater currentSlug={slug} prevPost={adjacentPosts.prev} nextPost={adjacentPosts.next} />

      <article className="prose prose-slate dark:prose-invert max-w-none" id="article-content">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-mono text-sm">
            <time>
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span>by {post.author}</span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/tags#${tag}`}
                  className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-900/50 hover:text-teal-600 dark:hover:text-teal-400 px-2.5 py-1 rounded-full transition-colors no-underline"
                >
                  <TagIcon size={12} className="mr-1.5" />
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        <MDXRemote
          source={post.content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkMath],
              rehypePlugins: [rehypeSlug, rehypeKatex],
            },
          }}
        />

      </article>
      <CommentSection slug={slug} title={post.title} />
    </main>
  );
}
