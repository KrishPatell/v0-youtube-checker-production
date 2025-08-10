import Link from "next/link"
import { blogPosts } from "@/lib/blog-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sitemap - YTMonetizer - Complete Website Structure",
  description:
    "Complete sitemap of YTMonetizer.com with all pages, tools, and blog posts for YouTube monetization analysis and strategies.",
  keywords: "YouTube monetization, sitemap, YouTube earnings, monetization checker, YouTube analytics",
}

export default function SitemapPage() {
  // Group blog posts by category
  const blogsByCategory: Record<string, typeof blogPosts> = {}

  blogPosts.forEach((post) => {
    if (!blogsByCategory[post.category]) {
      blogsByCategory[post.category] = []
    }
    blogsByCategory[post.category].push(post)
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header is now in app/layout.tsx */}

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">YTMonetizer Sitemap</h1>
          <p className="text-lg text-slate-600 mb-12 text-center">
            Complete index of all pages on YTMonetizer.com to help you navigate our tools and resources
          </p>

          <div className="space-y-12">
            {/* Main Pages Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Main Pages</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="bg-white p-4 rounded-lg shadow-sm">
                  <Link href="/" className="text-blue-600 hover:underline font-medium">
                    Home Page
                  </Link>
                  <p className="text-sm text-slate-600 mt-1">
                    YouTube Monetization Checker tool and overview of our services
                  </p>
                </li>
                <li className="bg-white p-4 rounded-lg shadow-sm">
                  <Link href="/blogs" className="text-blue-600 hover:underline font-medium">
                    Blog Index
                  </Link>
                  <p className="text-sm text-slate-600 mt-1">
                    All articles about YouTube monetization strategies and tips
                  </p>
                </li>
                <li className="bg-white p-4 rounded-lg shadow-sm">
                  <Link href="/sitemap" className="text-blue-600 hover:underline font-medium">
                    Sitemap
                  </Link>
                  <p className="text-sm text-slate-600 mt-1">Complete index of all pages on YTMonetizer.com</p>
                </li>
              </ul>
            </section>

            {/* Tools Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Tools & Utilities</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="bg-white p-4 rounded-lg shadow-sm">
                  <Link href="/" className="text-blue-600 hover:underline font-medium">
                    YouTube Monetization Checker
                  </Link>
                  <p className="text-sm text-slate-600 mt-1">
                    Check if a YouTube channel is monetized and analyze its revenue potential
                  </p>
                </li>
                <li className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-blue-600 font-medium">YouTube Revenue Calculator</span>
                  <p className="text-sm text-slate-600 mt-1">
                    Calculate potential earnings based on views, niche, and audience demographics
                  </p>
                </li>
                <li className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-blue-600 font-medium">Tag Extractor</span>
                  <p className="text-sm text-slate-600 mt-1">Extract and analyze tags from any YouTube video</p>
                </li>
                <li className="bg-white p-4 rounded-lg shadow-sm">
                  <Link href="/tools/youtube/channel-id-finder" className="text-blue-600 hover:underline font-medium">
                    Channel ID Finder
                  </Link>
                  <p className="text-sm text-slate-600 mt-1">Find the channel ID for any YouTube channel</p>
                </li>
              </ul>
            </section>

            {/* Blog Categories Section */}
            {Object.entries(blogsByCategory).map(([category, posts]) => (
              <section key={category}>
                <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{category} Articles</h2>
                <ul className="grid grid-cols-1 gap-4">
                  {posts.map((post) => (
                    <li key={post.id} className="bg-white p-4 rounded-lg shadow-sm">
                      <Link href={`/blogs/${post.slug}`} className="text-blue-600 hover:underline font-medium">
                        {post.title}
                      </Link>
                      <p className="text-sm text-slate-600 mt-1">{post.excerpt}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        Published: {post.publishedAt} • {post.readTime}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* XML Sitemap Section */}
          <section className="mt-16 bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-xl font-bold mb-4">XML Sitemap for Search Engines</h2>
            <p className="text-slate-700 mb-4">For search engine crawlers and bots, we provide an XML sitemap at:</p>
            <div className="bg-white p-3 rounded border border-slate-200 font-mono text-sm">
              https://ytmonetizer.com/sitemap.xml
            </div>
            <p className="text-sm text-slate-600 mt-4">
              This XML sitemap is automatically updated whenever new content is added to our website.
            </p>
          </section>
        </div>
      </main>

      {/* Footer is now in app/layout.tsx */}
    </div>
  )
}
