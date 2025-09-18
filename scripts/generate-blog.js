#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Load keywords from file
async function loadKeywords() {
  const keywordsFile = path.join(process.cwd(), 'data', 'keywords.json');
  
  try {
    const data = await fs.readFile(keywordsFile, 'utf8');
    const keywords = JSON.parse(data);
    
    // Get unused keywords sorted by search volume
    const unusedKeywords = keywords
      .filter(k => !k.used)
      .sort((a, b) => b.search_volume - a.search_volume);
    
    return unusedKeywords;
  } catch (error) {
    console.error('❌ Error loading keywords:', error.message);
    return [];
  }
}

// Generate blog content using OpenAI
async function generateBlogContent(keyword) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  console.log(`📝 Generating blog content for keyword: ${keyword.keyword}`);

  const prompt = `You are an expert SEO content writer with 10+ years of experience in YouTube monetization, growth hacking, and digital marketing. Create a comprehensive blog post that:

1. Targets the keyword: ${keyword.keyword}
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

Keyword: ${keyword.keyword}
Search Volume: ${keyword.search_volume}
Keyword Difficulty: ${keyword.keyword_difficulty}

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
}`;

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
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// Generate cover image
async function generateCoverImage(title) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  console.log(`🎨 Generating cover image for: ${title}`);

  const prompt = `Create a professional, modern blog cover image for a YouTube monetization article titled '${title}'. The image should be:
- 1200x630 pixels (Open Graph optimized)
- Professional color scheme (blues, whites, subtle gradients)
- Include YouTube logo or monetization symbols
- Clean, modern design
- High contrast text overlay area
- Suitable for social media sharing
- No text on the image itself`;

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
  });

  if (!response.ok) {
    throw new Error(`OpenAI Image API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

// Fallback image from Unsplash
async function getFallbackImage(keyword) {
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashAccessKey) {
    return '/placeholder.svg';
  }

  try {
    console.log(`🖼️ Getting fallback image for: ${keyword}`);
    
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keyword + ' YouTube monetization')}&orientation=landscape&w=1200&h=630`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashAccessKey}`
        }
      }
    );

    if (!response.ok) {
      return '/placeholder.svg';
    }

    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error('Unsplash API error:', error);
    return '/placeholder.svg';
  }
}

// Calculate read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Update blog data file
async function updateBlogData(blogPost) {
  const blogDataFile = path.join(process.cwd(), 'lib', 'blog-data.ts');
  
  try {
    // Read current blog data
    const data = await fs.readFile(blogDataFile, 'utf8');
    
    // Find the export statement and insert new post
    const exportMatch = data.match(/export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\]/);
    if (!exportMatch) {
      throw new Error('Could not find blogPosts export in blog-data.ts');
    }
    
    const currentPosts = exportMatch[1];
    const newPostCode = `  {
    id: ${blogPost.id},
    title: "${blogPost.title}",
    slug: "${blogPost.slug}",
    excerpt: "${blogPost.excerpt}",
    content: \`${blogPost.content}\`,
    publishedAt: "${blogPost.publishedAt}",
    readTime: "${blogPost.readTime}",
    category: "${blogPost.category}",
    tags: ${JSON.stringify(blogPost.tags)},
    coverImage: "${blogPost.coverImage}",
    author: {
      name: "${blogPost.author.name}",
      avatar: "${blogPost.author.avatar}",
    },
  },`;
    
    const updatedData = data.replace(
      /export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\]/,
      `export const blogPosts: BlogPost[] = [${newPostCode}\n${currentPosts}]`
    );
    
    await fs.writeFile(blogDataFile, updatedData);
    console.log('✅ Updated blog-data.ts with new post');
    
  } catch (error) {
    console.error('❌ Error updating blog data:', error.message);
    throw error;
  }
}

// Mark keyword as used
async function markKeywordAsUsed(keyword) {
  const keywordsFile = path.join(process.cwd(), 'data', 'keywords.json');
  
  try {
    const data = await fs.readFile(keywordsFile, 'utf8');
    const keywords = JSON.parse(data);
    
    const keywordIndex = keywords.findIndex(k => k.keyword === keyword.keyword);
    if (keywordIndex !== -1) {
      keywords[keywordIndex].used = true;
      keywords[keywordIndex].used_at = new Date().toISOString();
      
      await fs.writeFile(keywordsFile, JSON.stringify(keywords, null, 2));
      console.log(`✅ Marked keyword "${keyword.keyword}" as used`);
    }
  } catch (error) {
    console.error('❌ Error marking keyword as used:', error.message);
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting blog generation process...');
    
    // Load keywords
    const keywords = await loadKeywords();
    if (keywords.length === 0) {
      console.log('❌ No unused keywords found. Please run keyword fetch first.');
      process.exit(1);
    }
    
    // Select the top keyword
    const selectedKeyword = keywords[0];
    console.log(`🎯 Selected keyword: ${selectedKeyword.keyword} (${selectedKeyword.search_volume} searches)`);
    
    // Generate content
    const content = await generateBlogContent(selectedKeyword);
    
    // Generate cover image
    let coverImage = '/placeholder.svg';
    try {
      coverImage = await generateCoverImage(content.title);
    } catch (error) {
      console.error('Image generation failed, using fallback:', error.message);
      coverImage = await getFallbackImage(selectedKeyword.keyword);
    }
    
    // Create blog post object
    const blogPost = {
      id: Date.now(), // Simple ID generation
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
      },
      seo_meta: content.seo_meta
    };
    
    // Update blog data
    await updateBlogData(blogPost);
    
    // Mark keyword as used
    await markKeywordAsUsed(selectedKeyword);
    
    console.log('✅ Blog generation process completed successfully!');
    console.log(`📝 Generated post: ${blogPost.title}`);
    console.log(`🔗 Slug: ${blogPost.slug}`);
    console.log(`📊 Read time: ${blogPost.readTime}`);
    console.log(`🏷️ Tags: ${blogPost.tags.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error generating blog:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateBlogContent, generateCoverImage, updateBlogData };
