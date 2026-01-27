import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import TagCloud from "@/components/TagCloud";

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export default async function TagsPage() {
  const posts = getAllPosts();

  // Extract all tags and count them
  const tagCounts: Record<string, number> = {};
  const postsByTag: Record<string, typeof posts> = {};

  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        
        if (!postsByTag[tag]) {
          postsByTag[tag] = [];
        }
        postsByTag[tag].push(post);
      });
    }
  });

  // Sort tags by count (descending) or alphabetical? 
  // Image shows mixed order, maybe random or by importance. 
  // Let's sort by count desc, then name asc.
  const sortedTags = Object.keys(tagCounts).sort((a, b) => {
    // const countDiff = tagCounts[b] - tagCounts[a];
    // if (countDiff !== 0) return countDiff;
    return a.localeCompare(b);
  });

  return (
    <main className="grow container mx-auto px-4 max-w-4xl py-10">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-teal-800 dark:text-teal-400 mb-6 tracking-tight">Tags</h1>
      </div>

      {/* Tag Cloud */}
      <TagCloud tags={sortedTags} counts={tagCounts} />

      {/* Posts by Tag */}
      <div className="space-y-16">
        {sortedTags.map(tag => (
          <section key={tag} id={tag} className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
              {tag}
            </h2>
            <div className="space-y-3">
              {postsByTag[tag].map(post => (
                <Link 
                  key={post.slug} 
                  href={`/blog/${post.slug}`}
                  className="block group no-underline"
                >
                  <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <h3 className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      {post.title}
                    </h3>
                    <time className="text-slate-400 dark:text-slate-500 text-sm font-mono whitespace-nowrap mt-2 md:mt-0 ml-0 md:ml-4 text-xs">
                      {formatDate(post.date)}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
