export interface Post {
  title: string;
  date: string;
  slug: string;
  tags?: string[];
}

export interface Project {
  title: string;
  description: string;
  links: { label: string; url: string }[];
  icon?: string; // Optional icon content (emoji or text)
}

export const projects: Project[] = [
  {
    title: "Jn-Blog",
    description: "A modern personal blog built with Next.js and Framer Motion, designed to deliver an immersive reading experience through smooth interactive animations.",
    icon: "📝",
    links: [
      { label: "GitHub", url: "https://github.com/HeLongaa/JnBlog" },
      { label: "Blog", url: "https://blog.helong.online/" }
    ],
  },
  {
    title: "Fake-News",
    description: "基于中文社交媒体谣言数据集，构建了一个自动检测虚假新闻的机器学习系统。",
    links: [
      { label: "GitHub", url: "https://github.com/HeLongaa/Fake-News" }
    ],
  },
  {
    title: "YNU-Tools",
    description: "YNU 常用的一些脚本",
    icon: "🛠️",
    links: [
      { label: "GitHub", url: "https://github.com/HeLongaa/YNU-Tools" }
    ],
  }
];
