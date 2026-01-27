import { blogConfig } from '@/blog.config';
import { getAllPosts } from '@/lib/posts';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const BASE_URL = origin;

  const posts = getAllPosts();
  
  const itemsXml = posts
    .map((post) => {
      const postUrl = `${BASE_URL}/blog/${post.slug}`;
      return `
        <item>
          <title>${post.title}</title>
          <link>${postUrl}</link>
          <guid>${postUrl}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description><![CDATA[${post.title}]]></description>
        </item>`;
    })
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${blogConfig.title}</title>
    <link>${BASE_URL}</link>
    <description>${blogConfig.description}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
