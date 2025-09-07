import Link from "next/link"
import Image from "next/image"
import { blogPosts } from "@/lib/blog-data"
import { Card, CardContent } from "@/components/ui/card"
import { Youtube, Search, FileText, Clock } from "lucide-react"
import type { Metadata } from "next"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Blog - YTMonetizer - YouTube Monetization Insights & Strategies",
  description:
    "Discover the latest YouTube monetization strategies, policy updates, and revenue optimization techniques from YTMonetizer's expert team.",
  keywords: "YouTube monetization, YouTube earnings, creator economy, YouTube algorithm, YouTube revenue",
  openGraph: {
    title: "YouTube Monetization Blog - YTMonetizer",
    description: "Expert insights, strategies, and updates to help you maximize your YouTube revenue",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Monetization Blog - YTMonetizer",
    description: "Expert insights, strategies, and updates to help you maximize your YouTube revenue",
  },
}

export default function BlogsPage() {
  // Group posts by category for better organization
  const categories = [...new Set(blogPosts.map((post) => post.category))]

  // Get featured posts (most recent)
  const featuredPosts = [...blogPosts]
    .sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime() // Use publishedAt
    })
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header is now in app/layout.tsx */}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">YouTube Monetization Blog</h1>
            <p className="text-slate-600 max-w-3xl mx-auto">
              Expert insights, strategies, and updates to help you maximize your YouTube revenue and navigate the
              ever-changing monetization landscape.
            </p>
          </div>

          {/* Featured Posts Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Link href={`/blogs/${post.slug}`} key={post.id} className="group">
                  <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.coverImage || "/placeholder.svg?height=192&width=384&text=Featured+Post"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="flex flex-col flex-grow p-6">
                      <div className="flex items-center mb-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                          <Image
                            src={post.author.avatar || "/placeholder.svg?height=32&width=32&text=Author"}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-sm text-slate-600">
                          <span>{post.author.name}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                      <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-slate-600 text-sm mb-4 flex-grow">{post.excerpt}</p>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Categories Sections */}
          {categories.map((category) => {
            const categoryPosts = blogPosts.filter((post) => post.category === category)
            return (
              <section key={category} className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{category} Articles</h2>
                  <Link href={`/blogs?category=${category}`} className="text-blue-600 hover:underline text-sm">
                    View all {category} articles →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryPosts.slice(0, 3).map((post) => (
                    <Link href={`/blogs/${post.slug}`} key={post.id} className="group">
                      <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={post.coverImage || "/placeholder.svg?height=192&width=384&text=Category+Post"}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <CardContent className="flex flex-col flex-grow p-6">
                          <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-slate-600 text-sm mb-4 flex-grow">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">{formatDate(post.publishedAt)}</span>
                            <span className="text-sm text-slate-500">{post.readTime}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}

          <div className="mt-16 bg-white p-8 rounded-xl border-0 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">YouTube Monetization Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Latest Updates</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="bg-red-100 text-red-600 p-2 rounded-full flex-shrink-0">
                      <Youtube className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="font-medium">YouTube Reduces Subscriber Requirement</h4>
                      <p className="text-sm text-slate-600">
                        YouTube has lowered the subscriber threshold from 1,000 to 500 for monetization eligibility.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-100 text-green-600 p-2 rounded-full flex-shrink-0">
                      <FileText className="h-5 w-5" /> {/* Changed CheckCircle to FileText */}
                    </span>
                    <div>
                      <h4 className="font-medium">Shorts Revenue Sharing Expanded</h4>
                      <p className="text-sm text-slate-600">
                        YouTube has expanded the Shorts revenue sharing program to more countries and creators.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-full flex-shrink-0">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="font-medium">New Ad Formats Introduced</h4>
                      <p className="text-sm text-slate-600">
                        YouTube has introduced new ad formats that offer higher CPM rates for eligible creators.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Free Tools</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="bg-purple-100 text-purple-600 p-2 rounded-full flex-shrink-0">
                      <Search className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="font-medium">YouTube Monetization Checker</h4>
                      <p className="text-sm text-slate-600">
                        Check if a channel meets the requirements for monetization and estimate potential earnings.
                      </p>
                      <Link href="/" className="text-sm text-blue-600 hover:underline">
                        Try it now →
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-amber-100 text-amber-600 p-2 rounded-full flex-shrink-0">
                      <FileText className="h-5 w-5" /> {/* Changed CheckCircle to FileText */}
                    </span>
                    <div>
                      <h4 className="font-medium">Revenue Calculator</h4>
                      <p className="text-sm text-slate-600">
                        Estimate your potential YouTube earnings based on views, niche, and audience demographics.
                      </p>
                      <Link href="/" className="text-sm text-blue-600 hover:underline">
                        Calculate now →
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-teal-100 text-teal-600 p-2 rounded-full flex-shrink-0">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="font-medium">Keyword Research Tool</h4>
                      <p className="text-sm text-slate-600">
                        Find high-CPM keywords to optimize your video titles and descriptions.
                      </p>
                      <Link href="/" className="text-sm text-blue-600 hover:underline">
                        Research now →
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* SEO-optimized FAQ section */}
          <section className="mt-16 bg-white p-8 rounded-xl border-0 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2">What are the current YouTube monetization requirements?</h3>
                <p className="text-slate-600">
                  As of 2025, YouTube requires 500+ subscribers and either 3,000+ watch hours in the last 12 months OR 3
                  million Shorts views in the last 90 days. You also need at least 3 public uploads in the last 90 days
                  and follow all community guidelines.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">How much do YouTubers make per 1,000 views?</h3>
                <p className="text-slate-600">
                  Earnings vary widely by niche, audience location, and engagement. On average, YouTubers earn between
                  $2-$10 per 1,000 views (RPM). Finance, business, and technology channels typically earn on the higher
                  end, while entertainment and gaming channels often earn less.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">How can I increase my YouTube revenue?</h3>
                <p className="text-slate-600">
                  To increase your YouTube revenue, focus on creating longer videos (8+ minutes) to qualify for mid-roll
                  ads, target high-CPM niches, improve audience retention, upload consistently, and diversify your
                  revenue streams with channel memberships, Super Thanks, merchandise, and sponsorships.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Do YouTube Shorts make money?</h3>
                <p className="text-slate-600">
                  Yes, YouTube Shorts can be monetized through the Shorts Fund and ad revenue sharing. While the revenue
                  per view is typically lower than for long-form content, Shorts' viral potential can lead to
                  significant earnings through higher view counts and by driving traffic to your monetized long-form
                  content.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer is now in app/layout.tsx */}
    </div>
  )
}
