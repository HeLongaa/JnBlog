import { projects } from "@/lib/data";
import { getAllPosts } from "@/lib/posts";
import { Github, Twitter, Linkedin, Youtube, Mail, Send, Tag as TagIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { blogConfig } from "@/blog.config";

export default async function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <main className="grow container mx-auto px-4 max-w-4xl">
      {/* Hero Section */}
      <section className="py-20 md:py-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden min-h-[50vh] md:min-h-0">
        {/* Mobile Background Image */}
        <div className="absolute inset-0 z-0 md:hidden opacity-10 dark:opacity-20 pointer-events-none">
          <Image
            src="/avatar.png"
            alt="Background Avatar"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="md:w-1/2 relative z-10">
          <h1 className="text-5xl font-bold text-teal-700 dark:text-teal-400 mb-6">Hey! I'm {blogConfig.author}</h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
            Welcome to my Blog. 🌱
          </p>
          
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
            分享 <a className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">技术</a> 和 <a className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">生活</a> 的点滴。
          </p>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
            如果本站内容对你有帮助，可以<a href="/feed.xml" className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">订阅</a>我的博客。
          </p>
          <div className="flex space-x-3">
            {/* <a href="#" className="bg-slate-500 dark:bg-slate-700 p-2 rounded-full text-white hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors"><Twitter size={20} fill="currentColor" className="stroke-none" /></a> */}
            <a href="https://github.com/HeLongaa" className="bg-slate-500 dark:bg-slate-700 p-2 rounded-full text-white hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
            <a href="https://t.me/Benjamin_Smith00" className="bg-slate-500 dark:bg-slate-700 p-2 rounded-full text-white hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors" target="_blank" rel="noopener noreferrer"><Send size={20} /></a>
            {/* <a href="#" className="bg-slate-500 dark:bg-slate-700 p-2 rounded-full text-white hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors"><Linkedin size={20} fill="currentColor" className="stroke-none" /></a> */}
            <a href="https://www.youtube.com/@Duolaa" className="bg-slate-500 dark:bg-slate-700 p-2 rounded-full text-white hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors"><Youtube size={20} /></a>
            <a href="mailto:helongaa@yeah.net" className="bg-slate-500 dark:bg-slate-700 p-2 rounded-full text-white hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors"><Mail size={20} /></a>
          </div>
        </div>
        <div className="hidden md:flex md:w-1/2 justify-center mt-10 md:mt-0 relative translate-x-10">
            <Image
              src="/avatar.png"
              alt="HeLong Avatar"
              width={320}
              height={320}
              priority
              className="drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
        </div>
      </section>

      {/* Latest Posts */}
      <section className="mb-20">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300">Latest Posts</h2>
          <Link href="/blog" className="text-xs border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">View all</Link>
        </div>
        <div className="space-y-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="bg-slate-50 dark:bg-slate-900 px-6 py-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
              <div className="grow">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{post.title}</h3>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="flex items-center text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-full">
                          <TagIcon size={10} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-slate-400 dark:text-slate-500 text-sm whitespace-nowrap mt-2 md:mt-0 ml-0 md:ml-4 font-mono">{post.date}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-20">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300">Projects</h2>
          <Link href="/projects" className="text-xs border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.title} className="border border-slate-200 dark:border-slate-800 rounded-lg pt-6 px-6 pb-0 flex flex-col h-full hover:shadow-lg dark:hover:shadow-slate-900 transition-all bg-white dark:bg-slate-900 overflow-hidden">
              <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 mb-3 font-mono">{project.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 grow leading-relaxed">{project.description}</p>
              <div className="bg-slate-200/50 dark:bg-slate-800/50 -mx-6 py-3 px-6 flex space-x-4 text-xs text-slate-500 dark:text-slate-400 mt-auto border-t border-slate-100 dark:border-slate-800">
                {project.links.map((link) => (
                  <a key={link.label} href={link.url} className="flex items-center hover:text-teal-700 dark:hover:text-teal-400 font-semibold transition-colors">
                    {link.label} <span className="ml-1 text-[10px]">↗</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
