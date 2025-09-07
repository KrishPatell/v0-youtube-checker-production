import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { blogPosts } from "@/lib/blog-data"
import { Clock, Calendar, ArrowLeft, Facebook, Twitter, Linkedin } from "lucide-react" // Changed CheckCircle to FileText for blog icon consistency
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { formatDate } from "@/lib/utils"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((post) => post.slug === slug)

  if (!post) {
    return {
      title: "Blog Post Not Found - YTMonetizer",
      description: "The requested blog post could not be found.",
    }
  }

  // Enhanced metadata for better SEO
  return {
    title: `${post.title} - YTMonetizer Blog`,
    description: post.excerpt,
    keywords: `YouTube monetization, ${post.category.toLowerCase()}, YouTube earnings, ${post.slug.replace(/-/g, " ")}, YouTube analytics`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name], // Access author name
      tags: [post.category, "YouTube", "monetization", "creator economy"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = blogPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3)

  // Get recommended posts (different category, based on potential relevance)
  const recommendedPosts = blogPosts.filter((p) => p.category !== post.category && p.id !== post.id).slice(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header is now in app/layout.tsx */}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/blogs" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all articles
          </Link>

          <article className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={post.coverImage || "/placeholder.svg?height=400&width=800&text=Blog+Cover"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded">{post.category}</span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

              <div className="flex flex-wrap items-center text-slate-600 mb-8">
                <div className="flex items-center mr-6 mb-2">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={post.author.avatar || "/placeholder.svg?height=40&width=40&text=Author"}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center mr-6 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Table of Contents for SEO and user experience */}
              <div className="bg-slate-50 p-4 rounded-lg mb-8">
                <h2 className="text-lg font-bold mb-3">Table of Contents</h2>
                <ul className="space-y-1">
                  {post.content.match(/<h[23][^>]*>(.*?)<\/h[23]>/g)?.map((heading, index) => {
                    const text = heading.replace(/<\/?h[23][^>]*>/g, "")
                    const level = heading.startsWith("<h2") ? "h2" : "h3"
                    const id = text.toLowerCase().replace(/[^\w]+/g, "-")
                    return (
                      <li key={index} className={level === "h2" ? "font-medium" : "ml-4 text-sm"}>
                        <a href={`#${id}`} className="text-blue-600 hover:underline">
                          {text}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Render markdown content with proper styling */}
              <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({children, ...props}: any) => <h2 id={children?.toString().toLowerCase().replace(/[^\w]+/g, "-")} {...props} />,
                    h3: ({children, ...props}: any) => <h3 id={children?.toString().toLowerCase().replace(/[^\w]+/g, "-")} {...props} />,
                    img: ({...props}: any) => <img {...props} className="rounded-lg shadow-md" />,
                    a: ({href, children, ...props}: any) => {
                      // Check if it's an internal link (starts with / or is a relative path)
                      const isInternal = href?.startsWith('/') || href?.startsWith('#') || !href?.includes('://')
                      
                      return (
                        <a 
                          {...props} 
                          href={href}
                          className="text-blue-600 hover:text-blue-800 underline"
                          rel={isInternal ? undefined : "nofollow noopener noreferrer"}
                          target={isInternal ? undefined : "_blank"}
                        >
                          {children}
                        </a>
                      )
                    },
                    code: ({inline, className, children, ...props}: any) => 
                      inline ? 
                        <code {...props} className="bg-slate-100 px-1 py-0.5 rounded text-sm" /> : 
                        <code {...props} className="bg-slate-100 p-4 rounded-lg overflow-x-auto text-sm" />,
                    pre: ({...props}: any) => <pre {...props} className="bg-slate-100 p-4 rounded-lg overflow-x-auto" />
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Tags for SEO */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-sm text-slate-600">Tags:</span>
                  {post.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blogs?tag=${tag.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full hover:bg-slate-200"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <span className="text-slate-600 mr-3">Share this article:</span>
                    <Button variant="outline" size="sm" className="mr-2 rounded-full w-8 h-8 p-0 bg-transparent">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="mr-2 rounded-full w-8 h-8 p-0 bg-transparent">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0 bg-transparent">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-600 mr-3">Category:</span>
                    <Link
                      href={`/blogs?category=${post.category}`}
                      className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm hover:bg-slate-200"
                    >
                      {post.category}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Author Bio for E-E-A-T signals */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={post.author.avatar || "/placeholder.svg?height=64&width=64&text=Author"}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">About {post.author.name}</h3>
                <p className="text-slate-600 text-sm mb-2">
                  YouTube monetization expert with over 8 years of experience helping creators maximize their revenue.
                  Specializes in algorithm optimization, revenue diversification, and content strategy.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-7 rounded-full bg-transparent">
                    View all articles
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7 rounded-full bg-transparent">
                    Follow
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles Section - Enhanced for SEO */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link href={`/blogs/${relatedPost.slug}`} key={relatedPost.id} className="group">
                    <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                      <div className="relative h-40 w-full overflow-hidden">
                        <Image
                          src={relatedPost.coverImage || "/placeholder.svg?height=160&width=300&text=Related+Post"}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="flex flex-col flex-grow p-4">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{relatedPost.excerpt}</p>
                        <div className="flex items-center text-sm text-slate-500 mt-auto">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{relatedPost.readTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Articles from Different Categories */}
          {recommendedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedPosts.map((recommendedPost) => (
                  <Link href={`/blogs/${recommendedPost.slug}`} key={recommendedPost.id} className="group">
                    <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                      <div className="flex flex-col md:flex-row h-full">
                        <div className="relative h-40 md:h-auto md:w-1/3 overflow-hidden">
                          <Image
                            src={
                              recommendedPost.coverImage ||
                              "/placeholder.svg?height=160&width=200&text=Recommended+Post"
                            }
                            alt={recommendedPost.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <CardContent className="flex flex-col flex-grow p-4 md:w-2/3">
                          <span className="text-xs font-medium text-blue-600 mb-1">{recommendedPost.category}</span>
                          <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                            {recommendedPost.title}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{recommendedPost.excerpt}</p>
                          <div className="flex items-center text-sm text-slate-500 mt-auto">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{recommendedPost.readTime}</span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">Ready to check your channel's monetization status?</h2>
            <p className="text-slate-700 mb-6">
              Use our free YouTube Monetization Checker to analyze your channel's eligibility and estimate your
              potential earnings.
            </p>
            <Link href="/" passHref>
              <Button className="bg-blue-600 hover:bg-blue-700">Check Monetization Status</Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer is now in app/layout.tsx */}
    </div>
  )
}
