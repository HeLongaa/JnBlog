import { projects } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <main className="flex-grow container mx-auto px-4 max-w-4xl py-10">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-teal-800 dark:text-teal-400 mb-6 tracking-tight">Projects</h1>
        <p className="text-slate-600 dark:text-slate-400 text-xl font-medium">
          I made open source projects with ❤️
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.title} className="border border-slate-200 dark:border-slate-800 rounded-lg pt-6 px-6 pb-0 flex flex-col h-full hover:shadow-lg dark:hover:shadow-slate-900 transition-all bg-white dark:bg-slate-900 overflow-hidden">
            <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 mb-3 font-mono tracking-tight">
              {project.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-grow leading-relaxed">
              {project.icon && <span className="mr-2">{project.icon}</span>}
              {project.description}
            </p>
            <div className="bg-slate-200/50 dark:bg-slate-800/50 -mx-6 py-3 px-6 flex space-x-4 text-xs text-slate-500 dark:text-slate-400 mt-auto border-t border-slate-100 dark:border-slate-800">
              {project.links.map((link) => (
                <a 
                  key={link.label} 
                  href={link.url} 
                  className="flex items-center hover:text-teal-700 dark:hover:text-teal-400 font-semibold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label} <span className="ml-1 text-[10px]">↗</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
