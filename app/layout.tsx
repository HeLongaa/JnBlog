import type { Metadata } from "next";
import "./globals.css";
import 'katex/dist/katex.min.css';
import { LightboxProvider } from "@/context/LightboxContext";
import { BlogNavigationProvider } from "@/context/BlogNavigationContext";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import DockNav from "@/components/DockNav";
import { blogConfig } from "@/blog.config";

export const metadata: Metadata = {
  title:  blogConfig.title,
  description: blogConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var localTheme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (localTheme === 'dark' || (!localTheme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-sans min-h-screen flex flex-col overflow-x-hidden transition-colors duration-300">
        <LightboxProvider>
          <BlogNavigationProvider>
            <Navbar />
            <PageTransition>
              {children}
            </PageTransition>
            <Footer />
            <FloatingDock />
            <DockNav />
          </BlogNavigationProvider>
        </LightboxProvider>
      </body>
    </html>
  );
}
