// YouTube Tag Extractor API
const API_KEY = "AIzaSyAfvI_lxSrphIIZ9OIX-WKaQykJM7KSB5s"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

export interface VideoData {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  duration: string
  viewCount: string
  likeCount: string
  commentCount: string
  tags: string[]
  channelTitle: string
  channelId: string
  categoryId: string
  defaultLanguage: string
  defaultAudioLanguage: string
}

// Extract video ID from various YouTube URL formats
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*&v=)([^&\n?#]+)/,
    /youtu\.be\/([^?\n#]+)/,
    /youtube\.com\/embed\/([^?\n#]+)/,
    /youtube\.com\/v\/([^?\n#]+)/,
    /youtube\.com\/shorts\/([^?\n#]+)/,
    /youtube\.com\/live\/([^?\n#]+)/,
    /youtube\.com\/clip\/([^?\n#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

// Fetch real video data from YouTube API
export async function fetchVideoData(videoId: string): Promise<VideoData> {
  try {
    console.log(`Fetching video data for ID: ${videoId}`)
    
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails,status,topicDetails&id=${videoId}&key=${API_KEY}`
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`YouTube API error: ${response.status} - ${errorText}`)
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('YouTube API response:', data)

    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found or unavailable")
    }

    const video = data.items[0]
    const snippet = video.snippet || {}
    const statistics = video.statistics || {}
    const contentDetails = video.contentDetails || {}
    const status = video.status || {}
    const topicDetails = video.topicDetails || {}

    // Extract real video data with better fallbacks
    const videoData: VideoData = {
      id: video.id,
      title: snippet.title || "Unknown Title",
      description: snippet.description || "No description available",
      thumbnailUrl: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || "",
      publishedAt: snippet.publishedAt || new Date().toISOString(),
      duration: contentDetails.duration || "PT0S",
      viewCount: statistics.viewCount || "0",
      likeCount: statistics.likeCount || "0",
      commentCount: statistics.commentCount || "0",
      tags: snippet.tags || [],
      channelTitle: snippet.channelTitle || "Unknown Channel",
      channelId: snippet.channelId || "",
      categoryId: snippet.categoryId || "",
      defaultLanguage: snippet.defaultLanguage || "",
      defaultAudioLanguage: snippet.defaultAudioLanguage || ""
    }

    console.log('Processed video data:', videoData)
    return videoData
  } catch (error) {
    console.error("Error fetching video data:", error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        throw new Error("YouTube API quota exceeded. Please try again later.")
      } else if (error.message.includes('not found')) {
        throw new Error("Video not found. Please check the URL and try again.")
      } else if (error.message.includes('API error: 403')) {
        throw new Error("YouTube API access denied. Please check API key configuration.")
      }
    }
    
    throw error
  }
}

// Generate relevant tags based on video content
export function generateRelevantTags(videoData: VideoData): string[] {
  const tags: string[] = []

  // Add original tags if available (these are real tags from YouTube)
  if (videoData.tags && videoData.tags.length > 0) {
    const validTags = videoData.tags.filter(tag => 
      tag && tag.length > 0 && tag.length < 50 && !isCommonWord(tag)
    )
    tags.push(...validTags)
  }

  // Extract meaningful keywords from title
  if (videoData.title && videoData.title !== "Unknown Title") {
    const titleWords = extractKeywords(videoData.title, 8)
    tags.push(...titleWords)
  }

  // Extract meaningful keywords from description
  if (videoData.description && videoData.description !== "No description available") {
    const descriptionText = videoData.description.substring(0, 500) // Increased from 300
    const descriptionWords = extractKeywords(descriptionText, 15)
    tags.push(...descriptionWords)
  }

  // Add category-based tags
  if (videoData.categoryId) {
    const categoryTags = getCategoryTags(videoData.categoryId)
    tags.push(...categoryTags)
  }

  // Add language-based tags
  if (videoData.defaultLanguage && videoData.defaultLanguage.length === 2) {
    tags.push(videoData.defaultLanguage)
  }

  // Add channel-based tags
  if (videoData.channelTitle && videoData.channelTitle !== "Unknown Channel") {
    const channelWords = extractKeywords(videoData.channelTitle, 3)
    tags.push(...channelWords)
  }

  // Add trending and engagement tags based on statistics
  if (parseInt(videoData.viewCount) > 1000000) {
    tags.push("viral", "trending", "popular")
  }
  if (parseInt(videoData.likeCount) > 10000) {
    tags.push("liked", "favorite", "recommended")
  }

  // Remove duplicates and limit to reasonable number
  const uniqueTags = [...new Set(tags)]
    .filter(tag => tag && tag.length > 0 && tag.length < 30)
    .slice(0, 50) // Increased from 40

  return uniqueTags
}

// Extract meaningful keywords from text
function extractKeywords(text: string, maxWords: number): string[] {
  const commonWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an',
    'this', 'that', 'they', 'have', 'from', 'your', 'will', 'can', 'get', 'one', 'time', 'would',
    'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'which', 'go', 'me', 'when',
    'make', 'like', 'into', 'him', 'two', 'more', 'no', 'way', 'could', 'my', 'than', 'first',
    'been', 'call', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'come', 'made', 'may',
    'part', 'over', 'new', 'sound', 'take', 'only', 'little', 'work', 'know', 'place', 'year',
    'live', 'me', 'back', 'give', 'most', 'very', 'after', 'thing', 'our', 'just', 'name', 'good',
    'sentence', 'man', 'think', 'say', 'great', 'where', 'help', 'through', 'much', 'before', 'line',
    'right', 'too', 'mean', 'old', 'any', 'same', 'tell', 'boy', 'follow', 'came', 'want', 'show',
    'also', 'around', 'form', 'three', 'small', 'set', 'put', 'end', 'does', 'another', 'well',
    'large', 'must', 'big', 'even', 'such', 'because', 'turn', 'here', 'why', 'ask', 'went', 'men',
    'read', 'need', 'land', 'different', 'home', 'us', 'move', 'try', 'kind', 'hand', 'picture',
    'again', 'change', 'off', 'play', 'spell', 'air', 'away', 'animal', 'house', 'point', 'page',
    'letter', 'mother', 'answer', 'found', 'study', 'still', 'learn', 'should', 'America', 'world'
  ])

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => 
      word.length > 2 && 
      !commonWords.has(word) &&
      !/^\d+$/.test(word) // Filter out pure numbers
    )
    .slice(0, maxWords)
}

// Check if a word is too common to be useful as a tag
function isCommonWord(word: string): boolean {
  const commonWords = new Set([
    'video', 'youtube', 'channel', 'subscribe', 'like', 'comment', 'share',
    'watch', 'new', 'latest', 'update', 'upload', 'post', 'content', 'media'
  ])
  return commonWords.has(word.toLowerCase())
}

// Get category-specific tags
function getCategoryTags(categoryId: string): string[] {
  const categoryMap: { [key: string]: string[] } = {
    "1": ["entertainment", "fun", "viral", "trending", "popular", "viral", "trending"],
    "2": ["automotive", "cars", "vehicles", "transportation", "driving", "reviews", "maintenance"],
    "10": ["music", "songs", "artists", "entertainment", "lyrics", "music video", "concert"],
    "15": ["pets", "animals", "cute", "funny", "dogs", "cats", "wildlife", "nature"],
    "17": ["sports", "fitness", "athletics", "competition", "training", "workout", "health"],
    "19": ["travel", "tourism", "adventure", "exploration", "vacation", "destinations", "culture"],
    "20": ["gaming", "video games", "esports", "streaming", "gameplay", "walkthrough", "reviews"],
    "22": ["people", "lifestyle", "vlogs", "personal", "daily life", "routine", "experiences"],
    "23": ["comedy", "humor", "funny", "entertainment", "jokes", "skits", "standup"],
    "24": ["entertainment", "movies", "tv shows", "media", "reviews", "trailers", "behind the scenes"],
    "25": ["news", "politics", "current events", "information", "analysis", "breaking news", "updates"],
    "26": ["how-to", "tutorial", "education", "learning", "tips", "tricks", "guide"],
    "27": ["education", "academic", "learning", "knowledge", "courses", "lectures", "study"],
    "28": ["science", "technology", "research", "discovery", "innovation", "breakthroughs", "experiments"],
    "29": ["nonprofits", "activism", "social causes", "charity", "volunteering", "community service"],
    "30": ["movies", "cinema", "film", "entertainment", "reviews", "trailers", "interviews"],
    "31": ["anime", "animation", "japanese", "manga", "cartoons", "anime reviews"],
    "32": ["action", "adventure", "thriller", "excitement", "stunts", "action movies"],
    "33": ["classics", "vintage", "retro", "nostalgia", "old movies", "classic films"],
    "34": ["comedy", "humor", "funny", "entertainment", "standup", "skits", "jokes"],
    "35": ["documentary", "educational", "informative", "real life", "investigation", "expose"],
    "36": ["drama", "emotional", "serious", "theater", "acting", "performances"],
    "37": ["family", "kids", "children", "family friendly", "parenting", "family activities"],
    "38": ["foreign", "international", "world cinema", "subtitles", "dubbed", "cultural"],
    "39": ["horror", "scary", "thriller", "suspense", "fear", "supernatural"],
    "40": ["sci-fi", "science fiction", "futuristic", "space", "technology", "fantasy"],
    "41": ["thriller", "suspense", "mystery", "crime", "detective", "investigation"],
    "42": ["shorts", "short films", "quick content", "bite-sized", "entertainment"],
    "43": ["shows", "television", "tv series", "episodes", "seasons", "broadcast"],
    "44": ["trailers", "movie previews", "upcoming", "releases", "teasers", "promos"]
  }

  return categoryMap[categoryId] || []
}

// Format duration from ISO 8601 to readable format
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "0:00"

  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  const seconds = match[3] ? parseInt(match[3]) : 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}

// Format numbers with appropriate suffixes
export function formatNumber(num: string | number): string {
  const n = typeof num === 'string' ? parseInt(num) : num
  
  if (n >= 1000000000) {
    return (n / 1000000000).toFixed(1) + 'B'
  } else if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M'
  } else if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'K'
  } else {
    return n.toString()
  }
}

// Format date to readable format
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Analyze video engagement and suggest engagement-based tags
export function analyzeEngagement(videoData: VideoData): string[] {
  const engagementTags: string[] = []
  const views = parseInt(videoData.viewCount)
  const likes = parseInt(videoData.likeCount)
  const comments = parseInt(videoData.commentCount)

  // View-based engagement
  if (views > 10000000) {
    engagementTags.push("viral", "trending", "blockbuster", "millions of views")
  } else if (views > 1000000) {
    engagementTags.push("viral", "trending", "popular", "highly viewed")
  } else if (views > 100000) {
    engagementTags.push("popular", "well viewed", "growing")
  }

  // Like-based engagement
  if (likes > 100000) {
    engagementTags.push("highly liked", "favorite", "beloved", "treasured")
  } else if (likes > 10000) {
    engagementTags.push("liked", "favorite", "recommended")
  }

  // Comment engagement
  if (comments > 10000) {
    engagementTags.push("highly discussed", "controversial", "debated", "viral discussion")
  } else if (comments > 1000) {
    engagementTags.push("discussed", "community engagement", "active comments")
  }

  return engagementTags
}

// Validate and clean tags for better quality
export function validateTags(tags: string[]): string[] {
  return tags
    .filter(tag => {
      // Remove empty or very short tags
      if (!tag || tag.trim().length < 2) return false
      
      // Remove very long tags
      if (tag.length > 50) return false
      
      // Remove tags that are just numbers
      if (/^\d+$/.test(tag)) return false
      
      // Remove tags that are just common words
      if (isCommonWord(tag)) return false
      
      // Remove tags with excessive special characters
      if ((tag.match(/[^\w\s]/g) || []).length > tag.length * 0.3) return false
      
      return true
    })
    .map(tag => tag.trim().toLowerCase())
    .slice(0, 50) // Limit to 50 tags
}

// Get trending tags based on video statistics and recency
export function getTrendingTags(videoData: VideoData): string[] {
  const trendingTags: string[] = []
  const publishedDate = new Date(videoData.publishedAt)
  const now = new Date()
  const daysSincePublished = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // Recent videos get trending tags
  if (daysSincePublished <= 7) {
    trendingTags.push("new", "recent", "latest", "fresh", "just uploaded")
  }
  
  // High engagement videos get viral tags
  const views = parseInt(videoData.viewCount)
  if (views > 1000000 && daysSincePublished <= 30) {
    trendingTags.push("trending", "viral", "hot", "popular right now")
  }
  
  return trendingTags
}

// Generate SEO-optimized tags for better discoverability
export function generateSEOTags(videoData: VideoData): string[] {
  const seoTags: string[] = []
  
  // Add category-specific SEO tags
  if (videoData.categoryId) {
    const categoryTags = getCategoryTags(videoData.categoryId)
    seoTags.push(...categoryTags)
  }
  
  // Add language-specific tags
  if (videoData.defaultLanguage) {
    seoTags.push(videoData.defaultLanguage)
  }
  
  // Add trending and engagement tags
  seoTags.push(...getTrendingTags(videoData))
  seoTags.push(...analyzeEngagement(videoData))
  
  return seoTags
}

// Comprehensive tag generation that combines all approaches
export function generateComprehensiveTags(videoData: VideoData): string[] {
  const allTags: string[] = []
  
  // 1. Original YouTube tags (most important)
  if (videoData.tags && videoData.tags.length > 0) {
    const validOriginalTags = videoData.tags.filter(tag => 
      tag && tag.length > 0 && tag.length < 50 && !isCommonWord(tag)
    )
    allTags.push(...validOriginalTags)
  }
  
  // 2. Content-based tags from title and description
  if (videoData.title && videoData.title !== "Unknown Title") {
    const titleTags = extractKeywords(videoData.title, 10)
    allTags.push(...titleTags)
  }
  
  if (videoData.description && videoData.description !== "No description available") {
    const descriptionTags = extractKeywords(videoData.description.substring(0, 600), 20)
    allTags.push(...descriptionTags)
  }
  
  // 3. Category and channel tags
  if (videoData.categoryId) {
    const categoryTags = getCategoryTags(videoData.categoryId)
    allTags.push(...categoryTags)
  }
  
  if (videoData.channelTitle && videoData.channelTitle !== "Unknown Channel") {
    const channelTags = extractKeywords(videoData.channelTitle, 4)
    allTags.push(...channelTags)
  }
  
  // 4. Engagement and trending tags
  allTags.push(...analyzeEngagement(videoData))
  allTags.push(...getTrendingTags(videoData))
  
  // 5. Language and metadata tags
  if (videoData.defaultLanguage && videoData.defaultLanguage.length === 2) {
    allTags.push(videoData.defaultLanguage)
  }
  
  // 6. SEO optimization tags
  allTags.push(...generateSEOTags(videoData))
  
  // Clean, validate, and return final tags
  const finalTags = validateTags(allTags)
  
  // Ensure we have a good mix of different tag types
  const tagTypes = {
    original: videoData.tags?.length || 0,
    content: finalTags.filter(tag => !isCommonWord(tag)).length,
    category: finalTags.filter(tag => getCategoryTags(videoData.categoryId || "").includes(tag)).length,
    engagement: finalTags.filter(tag => ["viral", "trending", "popular", "liked"].includes(tag)).length
  }
  
  console.log('Tag generation summary:', {
    totalTags: finalTags.length,
    tagTypes,
    videoTitle: videoData.title,
    categoryId: videoData.categoryId
  })
  
  return finalTags
}
