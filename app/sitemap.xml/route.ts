import { NextRequest } from 'next/server'
import { blogPosts } from '@/lib/blog-data'

export async function GET(request: NextRequest) {
  const baseUrl = 'https://youtube-monetization-checker.com'
  
  // Static pages
  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }
  ]

  // Tool pages
  const toolPages = [
    {
      url: `${baseUrl}/tools/youtube/channel-id-finder`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/tools/youtube-tag-extractor`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    }
  ]

  // Blog pages
  const blogPages = blogPosts.map(blog => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }))

  // Combine all pages
  const allPages = [...staticPages, ...toolPages, ...blogPages]

  // Generate XML sitemap
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400'
    }
  })
}
