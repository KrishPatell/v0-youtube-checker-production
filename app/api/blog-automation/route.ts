import { NextRequest, NextResponse } from 'next/server'
import { blogPosts } from '@/lib/blog-data'
import { BlogPost } from '@/lib/blog-data'

// Ahrefs API integration
async function fetchAhrefsKeywords() {
  const ahrefsApiKey = process.env.AHREFS_API_KEY
  if (!ahrefsApiKey) {
    throw new Error('AHREFS_API_KEY not configured')
  }

  const response = await fetch('https://apiv2.ahrefs.com', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ahrefsApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target: 'youtube.com',
      mode: 'subdomains',
      limit: 50,
      order_by: 'search_volume:desc',
      where: 'search_volume > 1000 AND keyword_difficulty < 30'
    })
  })

  if (!response.ok) {
    throw new Error(`Ahrefs API error: ${response.statusText}`)
  }

  return response.json()
}

// OpenAI content generation
async function generateBlogContent(keyword: string, searchVolume: number, keywordDifficulty: number) {
  const openaiApiKey = process.env.OPENAI_API_KEY
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  const prompt = `You are an expert SEO content writer with 10+ years of experience in YouTube monetization, growth hacking, and digital marketing. Create a comprehensive blog post that:

1. Targets the keyword: ${keyword}
2. Includes advanced SEO practices:
   - Proper heading structure (H1, H2, H3)
   - Meta description optimization
   - Internal linking opportunities
   - Long-tail keyword variations
   - FAQ sections
   - Schema markup suggestions
   - E-A-T (Expertise, Authoritativeness, Trustworthiness) signals

3. Content structure:
   - Compelling hook in first 100 words
   - 2000-3000 words total
   - Actionable insights and strategies
   - Data-driven examples
   - Current 2025 trends and updates
   - Clear call-to-actions

4. Tone: Professional, authoritative, but accessible
5. Include specific YouTube monetization examples and case studies
6. Add relevant statistics and data points
7. Create a comprehensive outline first, then write the full content

Keyword: ${keyword}
Search Volume: ${searchVolume}
Keyword Difficulty: ${keywordDifficulty}

Return the response in this JSON format:
{
  "title": "SEO-optimized title",
  "slug": "url-friendly-slug",
  "excerpt": "Compelling meta description (150-160 chars)",
  "content": "Full markdown content with proper headings",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "YouTube Monetization",
  "readTime": "X min read",
  "seo_meta": {
    "focus_keyword": "primary keyword",
    "secondary_keywords": ["keyword1", "keyword2"],
    "internal_links": ["suggested internal link 1", "suggested internal link 2"],
    "schema_suggestions": ["Article", "FAQPage", "HowTo"]
  }
}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}

// Generate cover image
async function generateCoverImage(title: string) {
  const openaiApiKey = process.env.OPENAI_API_KEY
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  const prompt = `Create a professional, modern blog cover image for a YouTube monetization article titled '${title}'. The image should be:
- 1200x630 pixels (Open Graph optimized)
- Professional color scheme (blues, whites, subtle gradients)
- Include YouTube logo or monetization symbols
- Clean, modern design
- High contrast text overlay area
- Suitable for social media sharing
- No text on the image itself`

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      size: '1792x1024',
      quality: 'hd',
      style: 'natural',
      n: 1
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI Image API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data[0].url
}

// Fallback image from Unsplash
async function getFallbackImage(keyword: string) {
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!unsplashAccessKey) {
    return '/placeholder.svg'
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keyword + ' YouTube monetization')}&orientation=landscape&w=1200&h=630`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashAccessKey}`
        }
      }
    )

    if (!response.ok) {
      return '/placeholder.svg'
    }

    const data = await response.json()
    return data.urls.regular
  } catch (error) {
    console.error('Unsplash API error:', error)
    return '/placeholder.svg'
  }
}

// Calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// SEO optimization
function optimizeForSEO(content: any, keyword: string) {
  // Add internal linking suggestions
  const internalLinks = [
    '/tools/youtube/copyright-checker',
    '/tools/youtube/shorts-downloader',
    '/tools/youtube-tag-extractor',
    '/ranking-dashboard',
    '/blogs'
  ]

  // Add schema markup suggestions
  const schemaSuggestions = [
    'Article',
    'FAQPage',
    'HowTo',
    'VideoObject',
    'Organization'
  ]

  return {
    ...content,
    seo_meta: {
      focus_keyword: keyword,
      secondary_keywords: content.tags || [],
      internal_links: internalLinks,
      schema_suggestions: schemaSuggestions,
      meta_description: content.excerpt,
      og_title: content.title,
      og_description: content.excerpt,
      twitter_card: 'summary_large_image'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, keyword, searchVolume, keywordDifficulty } = await request.json()

    if (action === 'generate-blog') {
      // Generate blog content
      const content = await generateBlogContent(keyword, searchVolume, keywordDifficulty)
      
      // Generate cover image
      let coverImage = '/placeholder.svg'
      try {
        coverImage = await generateCoverImage(content.title)
      } catch (error) {
        console.error('Image generation failed, using fallback:', error)
        coverImage = await getFallbackImage(keyword)
      }

      // Create blog post object
      const newPost: BlogPost = {
        id: Math.max(...blogPosts.map(p => p.id)) + 1,
        title: content.title,
        slug: generateSlug(content.title),
        excerpt: content.excerpt,
        content: content.content,
        publishedAt: new Date().toISOString().split('T')[0],
        readTime: calculateReadTime(content.content),
        category: content.category || 'YouTube Monetization',
        tags: content.tags || [],
        coverImage: coverImage,
        author: {
          name: 'Krish Patel',
          avatar: '/placeholder-user.jpg'
        }
      }

      // Optimize for SEO
      const optimizedPost = optimizeForSEO(newPost, keyword)

      // In a real implementation, you would save this to a database
      // For now, we'll return the generated content
      return NextResponse.json({
        success: true,
        blogPost: optimizedPost,
        message: 'Blog post generated successfully'
      })

    } else if (action === 'fetch-keywords') {
      // Fetch keywords from Ahrefs
      const keywords = await fetchAhrefsKeywords()
      
      return NextResponse.json({
        success: true,
        keywords: keywords,
        message: 'Keywords fetched successfully'
      })

    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Blog automation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Blog automation failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Blog automation API is running',
    endpoints: {
      'POST /api/blog-automation': 'Generate blog posts or fetch keywords',
      'GET /api/blog-automation': 'API status'
    },
    actions: {
      'generate-blog': 'Generate a new blog post from keyword data',
      'fetch-keywords': 'Fetch high-ranking keywords from Ahrefs'
    }
  })
}
