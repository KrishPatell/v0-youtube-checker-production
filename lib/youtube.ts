// YouTube API utility functions
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "AIzaSyBGIhX9rYUTQS9G9H5JJRDKlie0G55Dgys"
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

export interface ChannelInfo {
  id: string
  title: string
  description: string
  thumbnail: string
  subscriberCount: string
  videoCount: string
  viewCount: string
  customUrl?: string
  handle?: string
  publishedAt: string
}

export interface SearchResult {
  success: boolean
  channel?: ChannelInfo
  error?: string
}

// Extract channel ID from various YouTube URL formats
export function extractChannelIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname

    // Handle different URL formats
    if (pathname.includes("/channel/")) {
      const match = pathname.match(/\/channel\/([a-zA-Z0-9_-]+)/)
      return match ? match[1] : null
    }

    if (pathname.includes("/c/") || pathname.includes("/user/") || pathname.includes("/@")) {
      // For custom URLs, handles, and usernames, we need to search
      return null
    }

    return null
  } catch {
    return null
  }
}

// Validate if a string is a valid YouTube channel ID
export function isValidChannelId(channelId: string): boolean {
  return /^UC[a-zA-Z0-9_-]{22}$/.test(channelId)
}

// Search for channels by name or custom URL
export async function searchChannels(query: string): Promise<SearchResult> {
  try {
    // First, try to extract channel ID from URL
    const directChannelId = extractChannelIdFromUrl(query)
    if (directChannelId && isValidChannelId(directChannelId)) {
      return await getChannelInfo(directChannelId)
    }

    // Search for channels
    const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&maxResults=1`
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    if (!searchResponse.ok) {
      throw new Error(searchData.error?.message || "Search failed")
    }

    if (!searchData.items || searchData.items.length === 0) {
      return { success: false, error: "No channels found" }
    }

    const channelId = searchData.items[0].snippet.channelId
    return await getChannelInfo(channelId)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Search failed",
    }
  }
}

// Get detailed channel information
export async function getChannelInfo(channelId: string): Promise<SearchResult> {
  try {
    const channelUrl = `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
    const response = await fetch(channelUrl)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch channel info")
    }

    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Channel not found" }
    }

    const channel = data.items[0]
    const snippet = channel.snippet
    const statistics = channel.statistics

    return {
      success: true,
      channel: {
        id: channel.id,
        title: snippet.title,
        description: snippet.description,
        thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || "",
        subscriberCount: formatNumber(statistics.subscriberCount || "0"),
        videoCount: formatNumber(statistics.videoCount || "0"),
        viewCount: formatNumber(statistics.viewCount || "0"),
        customUrl: snippet.customUrl,
        handle: snippet.customUrl?.startsWith("@") ? snippet.customUrl : undefined,
        publishedAt: snippet.publishedAt,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch channel info",
    }
  }
}

// Format large numbers for display
function formatNumber(num: string): string {
  const number = Number.parseInt(num)
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M"
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K"
  }
  return number.toString()
}
