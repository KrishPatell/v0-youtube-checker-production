// YouTube Shorts Downloader Utility Functions

export interface ShortsFormat {
  quality: string
  format: string
  url: string
  size?: string
}

export interface ShortsData {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  duration: string
  viewCount: string
  likeCount: string
  commentCount: string
  channelTitle: string
  channelId: string
  formats: ShortsFormat[]
}

// Extract video ID from various YouTube URL formats
export function extractShortsId(url: string): string | null {
  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

// Format duration from ISO 8601 format to readable format
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  
  if (!match) return 'Unknown'
  
  const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0
  const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0
  const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}

// Format view count with K, M, B suffixes
export function formatViewCount(count: string): string {
  const num = parseInt(count)
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  } else {
    return num.toString()
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

// Validate YouTube Shorts URL
export function isValidShortsUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[a-zA-Z0-9_-]+/,
    /^https?:\/\/youtu\.be\/[a-zA-Z0-9_-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/
  ]
  
  return patterns.some(pattern => pattern.test(url))
}

// Generate download filename
export function generateFilename(title: string, format: string, quality: string): string {
  const cleanTitle = title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-')
  return `${cleanTitle}-${quality}-${format.toLowerCase()}`
}

// Check if URL is a YouTube Shorts URL
export function isShortsUrl(url: string): boolean {
  return url.includes('/shorts/') || url.includes('youtu.be/')
}

// Get thumbnail URL with fallback
export function getThumbnailUrl(thumbnails: any): string {
  return thumbnails?.maxres?.url || 
         thumbnails?.high?.url || 
         thumbnails?.medium?.url || 
         thumbnails?.default?.url || 
         '/images/placeholder-thumbnail.png'
}

// Generate mock download formats (for development/demo purposes)
export function generateMockDownloadFormats(videoId: string): ShortsFormat[] {
  return [
    {
      quality: 'HD',
      format: 'MP4',
      url: `https://example.com/download/${videoId}/hd.mp4`,
      size: '15-25 MB'
    },
    {
      quality: 'Standard',
      format: 'MP4',
      url: `https://example.com/download/${videoId}/standard.mp4`,
      size: '8-15 MB'
    },
    {
      quality: 'Audio Only',
      format: 'MP3',
      url: `https://example.com/download/${videoId}/audio.mp3`,
      size: '3-8 MB'
    }
  ]
}

