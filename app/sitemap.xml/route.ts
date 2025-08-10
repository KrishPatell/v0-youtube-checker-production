import { blogPosts } from "../../lib/blog-data"

export async function GET() {
  const baseUrl = "https://ytmonetizer.com"

  // Format the current date in ISO format
  const date = new Date().toISOString()

  // Create the XML sitemap
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/tools/youtube/channel-id-finder</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/sitemap</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  ${blogPosts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}/blogs/${post.slug}</loc>
    <lastmod>${post.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join("")}
</urlset>`

  // Return the XML with the correct content type
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
