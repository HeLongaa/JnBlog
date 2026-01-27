import Link from "next/link";
import { getAllPosts, Post } from "@/lib/posts";
import { Tag as TagIcon } from "lucide-react";

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export default async function BlogPage() {
  const posts = getAllPosts();

  // Group posts by year
  const postsByYear = posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, Post[]>);

  // Get sorted years (descending)
  const sortedYears = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  // Calculate statistics
  const totalArticles = posts.length;
  const currentYear = new Date().getFullYear();
  const earliestYear = posts.length > 0 
    ? new Date(posts[posts.length - 1].date).getFullYear() 
    : currentYear;
  const yearsActive = currentYear - earliestYear + 1; // +1 to include current year if it's the same

  return (
    <main className="flex-grow container mx-auto px-4 max-w-4xl py-10">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-teal-800 dark:text-teal-400 mb-6 tracking-tight">Blog</h1>
        <p className="text-slate-600 dark:text-slate-400 text-xl font-medium">
          I’ve written {totalArticles} articles in the past {yearsActive} years.
        </p>
      </div>

      <div className="space-y-12">
        {sortedYears.map((year) => (
          <section key={year}>
            <h2 className="text-2xl font-bold text-slate-300 dark:text-slate-600 mb-6">{year}</h2>
            <div className="space-y-3">
              {postsByYear[year].map((post) => (
                <Link 
                  key={post.slug} 
                  href={`/blog/${post.slug}`}
                  className="block group no-underline"
                >
                  <article className="bg-slate-50 dark:bg-slate-900 px-6 py-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <h3 className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                          {post.title}
                        </h3>
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
                    <time className="text-slate-400 dark:text-slate-500 text-sm font-mono whitespace-nowrap mt-2 md:mt-0 ml-0 md:ml-4 text-xs">
                      {formatDate(post.date)}
                    </time>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
