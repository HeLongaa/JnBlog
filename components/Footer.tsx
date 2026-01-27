import { blogConfig } from "@/blog.config";

export default function Footer() {
  return (
    <footer className="py-4 mt-12 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-4xl text-center text-slate-500 dark:text-slate-400 text-base">
        <p className="mb-2">© 2025-2026 | {blogConfig.title} | <a href="/feed.xml" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Feed</a> | <a href="/sitemap.xml" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Sitemap</a> | <a href="/tags" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Tags</a></p>
        <p className="mb-2 inline-flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 1024 1024">
            <path d="M512 967.111111c170.666667-68.266667 284.444444-164.977778 341.333333-284.444444 73.955556-142.222222 91.022222-307.2 56.888889-500.622223L512 56.888889 113.777778 187.733333c-34.133333 187.733333-17.066667 352.711111 51.2 494.933334C227.555556 802.133333 341.333333 898.844444 512 967.111111z m-295.822222-307.2C153.6 534.755556 136.533333 392.533333 164.977778 227.555556L512 113.777778l347.022222 113.777778c22.755556 164.977778 5.688889 307.2-56.888889 426.666666-51.2 102.4-147.911111 182.044444-290.133333 244.622222-147.911111-56.888889-244.622222-142.222222-295.822222-238.933333z" />
            <path d="M512 631.466667L318.577778 438.044444l45.511111-39.822222L512 546.133333 716.8 341.333333l45.511111 39.822223z" />
          </svg>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            {blogConfig.beian}
          </a>
        </p>
        <div className="h-20"></div>
      </div>
    </footer>
  );
}
