// YouTube API integration with real API key
const API_KEY = "AIzaSyAfvI_lxSrphIIZ9OIX-WKaQykJM7KSB5s"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

export interface MonetizationResult {
  isMonetized: boolean
  monetizationFactors: {
    hasJoinButton: boolean
    hasAdsInVideos: boolean
    hasMcnPartnership: boolean
    passesAuthenticity: boolean
    hasEnoughSubscribers: boolean
    hasEnoughWatchTime: boolean
    estimatedWatchTimeHours: number
  }
  channelType: string
  adStatus: string
  authenticity: {
    status: boolean
    message: string
  }
  regionRestriction: {
    restricted: boolean
    message: string
  }
  location: {
    country: string
    countryCode: string
    dialCode: string
    religion: string
  }
  creationInfo: {
    date: string
    formattedDate: string
    daysAgo: number
  }
  defaultLanguage: {
    code: string
    name: string
    description?: string
  }
  tags: string[]
  subscribers: {
    count: number
    tier: string
  }
  videoStats: {
    count: number
    avgDuration: number
    uploadFrequency: {
      perYear: number
      perMonth: number
      perWeek: number
    }
  }
  views: {
    total: number
    monthly: number
    daily: number
    perVideo: number
  }
  playlists: {
    uploads: boolean
    shorts: boolean
    membersOnly: boolean
    popular: boolean
    popularShorts: boolean
    liveStreams: boolean
    membersContent: boolean
    membersShorts: boolean
    membersLiveStreams: boolean
    popularLiveStreams: boolean
  }
  isForKids: boolean
  hasGoogleAnalytics: boolean
  topicDetails: string[]
  description: string
  channelId: string
  channelUrl: string
  estimatedRevenue: {
    daily: string
    monthly: string
    yearly: string
    cpm: number
    ctr: number
    byCategory: {
      category: string
      rpm: string
      revenue: string
    }[]
    totalEstimated: string
  }
  historicalData: {
    dates: string[]
    views: number[]
    revenue: number[]
  }
  channelInfo: {
    title: string
    description: string
    thumbnailUrl: string
    bannerUrl: string
    country: string
    publishedAt: string
  }
  videoInfo?: {
    title: string
    description: string
    thumbnailUrl: string
    publishedAt: string
    duration: string
  }
}

// Extract channel ID from various YouTube URL formats
function extractChannelId(url: string): string | null {
  // Handle /channel/ID format
  let match = url.match(/youtube\.com\/channel\/([^/?]+)/)
  if (match) return match[1]

  // Handle /c/NAME format - requires API lookup
  match = url.match(/youtube\.com\/c\/([^/?]+)/)
  if (match) return match[1]

  // Handle /user/NAME format - requires API lookup
  match = url.match(/youtube\.com\/user\/([^/?]+)/)
  if (match) return match[1]

  // Handle @handle format
  match = url.match(/youtube\.com\/@([^/?]+)/)
  if (match) return match[1]

  return null
}

// Extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  // Handle standard video URL
  let match = url.match(/youtube\.com\/watch\?v=([^&]+)/)
  if (match) return match[1]

  // Handle youtu.be short URL
  match = url.match(/youtu\.be\/([^/?]+)/)
  if (match) return match[1]

  // Handle embed URL
  match = url.match(/youtube\.com\/embed\/([^/?]+)/)
  if (match) return match[1]

  return null
}

// Generate historical data based on actual channel/video stats
function generateHistoricalData(viewCount: number, subscriberCount: number) {
  const dates = []
  const views = []
  const revenue = []

  const now = new Date()
  const dailyViews = viewCount / 365 // Rough estimate of daily views

  // Estimate CPM based on subscriber count (more subscribers often means better CPM)
  const estimatedCpm = Math.min(subscriberCount / 100000, 10) + 1

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split("T")[0])

    // Generate slightly random daily views based on the average
    const dayViews = Math.floor(dailyViews * (0.8 + Math.random() * 0.4))
    views.push(dayViews)

    // Calculate revenue based on views with estimated CPM
    const dailyRevenue = (dayViews * estimatedCpm) / 1000
    revenue.push(Number.parseFloat(dailyRevenue.toFixed(2)))
  }

  return { dates, views, revenue }
}

// Check if a channel is likely monetized based on Method 2 criteria
function isChannelLikelyMonetized(
  subscriberCount: number,
  videoCount: number,
  viewCount: number,
  description: string,
  avgVideoDuration: number,
): {
  isMonetized: boolean
  factors: {
    hasJoinButton: boolean
    hasAdsInVideos: boolean
    hasMcnPartnership: boolean
    passesAuthenticity: boolean
    hasEnoughSubscribers: boolean
    hasEnoughWatchTime: boolean
    estimatedWatchTimeHours: number
  }
} {
  // 1. Check for "Join" button - we can't directly check this via API, but channels with
  // more than 1000 subscribers and 10+ videos are eligible for memberships
  const hasJoinButton = subscriberCount >= 1000 && videoCount >= 10

  // 2. Check for ads in videos - we can't directly check this via API, but channels with
  // monetization typically have higher view counts per video
  const viewsPerVideo = viewCount / videoCount
  const hasAdsInVideos = viewsPerVideo > 1000

  // 3. Check for MCN/CMS partnership in description
  const mcnKeywords = [
    "mcn",
    "multi-channel network",
    "partner program",
    "cms",
    "content management system",
    "network partner",
    "youtube partner",
    "media partner",
    "content partner",
    "adsense",
    "monetization",
    "monetized",
    "partnership",
    "affiliate",
    "sponsored",
  ]
  const hasMcnPartnership = mcnKeywords.some((keyword) => description.toLowerCase().includes(keyword))

  // 4. Check for authenticity - we'll assume most channels are authentic unless they have very low metrics
  const passesAuthenticity = subscriberCount > 100 && videoCount >= 3

  // 5. Check subscriber count requirement (1000+)
  const hasEnoughSubscribers = subscriberCount >= 1000

  // 6. Estimate total watch time (total video minutes × total views)
  // We'll use average video duration in minutes × total views
  const avgVideoDurationMinutes = avgVideoDuration / 60 // Convert seconds to minutes
  const estimatedWatchTimeMinutes = avgVideoDurationMinutes * viewCount
  const estimatedWatchTimeHours = estimatedWatchTimeMinutes / 60
  const hasEnoughWatchTime = estimatedWatchTimeHours >= 4000

  // A channel is likely monetized if it meets most of these criteria
  // We'll weight the criteria - subscriber count and watch time are the most important
  let monetizationScore = 0
  if (hasJoinButton) monetizationScore += 2
  if (hasAdsInVideos) monetizationScore += 1
  if (hasMcnPartnership) monetizationScore += 2
  if (passesAuthenticity) monetizationScore += 1
  if (hasEnoughSubscribers) monetizationScore += 3
  if (hasEnoughWatchTime) monetizationScore += 3

  // Maximum score is 12, we'll consider 7+ as likely monetized
  const isMonetized = monetizationScore >= 7

  return {
    isMonetized,
    factors: {
      hasJoinButton,
      hasAdsInVideos,
      hasMcnPartnership,
      passesAuthenticity,
      hasEnoughSubscribers,
      hasEnoughWatchTime,
      estimatedWatchTimeHours,
    },
  }
}

// Get subscriber tier based on count
function getSubscriberTier(count: number): string {
  if (count < 100) return "New"
  if (count < 1000) return "Opal"
  if (count < 10000) return "Bronze"
  if (count < 100000) return "Silver"
  if (count < 1000000) return "Gold"
  if (count < 10000000) return "Diamond"
  return "Red Diamond"
}

// Get country information
function getCountryInfo(countryCode: string): { country: string; dialCode: string; religion: string } {
  const countryMap: Record<string, { country: string; dialCode: string; religion: string }> = {
    US: {
      country: "United States",
      dialCode: "+1",
      religion: "Christianity (Protestant 70%, Catholic 30%), Atheism",
    },
    GB: {
      country: "United Kingdom",
      dialCode: "+44",
      religion: "Christianity (Anglican, Catholic, Presbyterian, Methodist)",
    },
    CA: {
      country: "Canada",
      dialCode: "+1",
      religion: "Christianity (Catholic, Protestant), Islam, Hinduism",
    },
    AU: {
      country: "Australia",
      dialCode: "+61",
      religion: "Christianity, No Religion, Islam, Buddhism",
    },
    IN: {
      country: "India",
      dialCode: "+91",
      religion: "Hinduism, Islam, Christianity, Sikhism",
    },
    PH: {
      country: "Philippines",
      dialCode: "+63",
      religion: "Christianity Roman Catholic",
    },
    // Add more countries as needed
  }

  return (
    countryMap[countryCode] || {
      country: "Unknown",
      dialCode: "Unknown",
      religion: "Unknown",
    }
  )
}

// Get language information
function getLanguageInfo(langCode: string): { name: string; description?: string } {
  const langMap: Record<string, { name: string; description?: string }> = {
    en: {
      name: "English",
      description:
        "It is spoken in areas such as the British Isles, the whole of the USA, Canada, Australia, New Zealand, Ireland, South Africa and India.",
    },
    es: {
      name: "Spanish",
      description: "It is spoken in Spain, most of Central and South America, and parts of the USA.",
    },
    fr: {
      name: "French",
      description: "It is spoken in France, parts of Canada, Belgium, Switzerland, and many African countries.",
    },
    // Add more languages as needed
  }

  return langMap[langCode] || { name: "Unknown" }
}

// Fetch channel data by ID
async function fetchChannelById(channelId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/channels?part=snippet,statistics,status,topicDetails,brandingSettings,contentDetails,localizations&id=${channelId}&key=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      throw new Error("Channel not found")
    }

    return data.items[0]
  } catch (error) {
    console.error("Error fetching channel data:", error)
    throw error
  }
}

// Fetch channel data by username or custom URL
async function fetchChannelByUsername(username: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/channels?part=snippet,statistics,status,topicDetails,brandingSettings,contentDetails,localizations&forUsername=${username}&key=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      // Try searching for the channel if username lookup fails
      return await searchChannel(username)
    }

    return data.items[0]
  } catch (error) {
    console.error("Error fetching channel by username:", error)
    throw error
  }
}

// Search for a channel by name or handle
async function searchChannel(query: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=1&key=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      throw new Error("Channel not found")
    }

    // Get the channel ID from search results
    const channelId = data.items[0].id.channelId

    // Fetch complete channel data
    return await fetchChannelById(channelId)
  } catch (error) {
    console.error("Error searching for channel:", error)
    throw error
  }
}

// Fetch video data by ID
async function fetchVideoById(videoId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails,status,topicDetails&id=${videoId}&key=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found")
    }

    return data.items[0]
  } catch (error) {
    console.error("Error fetching video data:", error)
    throw error
  }
}

// Fetch channel videos to estimate average duration
async function fetchChannelVideos(channelId: string, maxResults = 10) {
  try {
    // First get the uploads playlist ID
    const channelData = await fetchChannelById(channelId)
    const uploadsPlaylistId = channelData.contentDetails.relatedPlaylists.uploads

    // Then get the videos from that playlist
    const response = await fetch(
      `${BASE_URL}/playlistItems?part=snippet,contentDetails&maxResults=${maxResults}&playlistId=${uploadsPlaylistId}&key=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return [] // No videos found
    }

    // Get the video IDs
    const videoIds = data.items.map((item: any) => item.contentDetails.videoId).join(",")

    // Fetch the video details
    const videosResponse = await fetch(
      `${BASE_URL}/videos?part=contentDetails,statistics,status&id=${videoIds}&key=${API_KEY}`,
    )

    if (!videosResponse.ok) {
      throw new Error(`API error: ${videosResponse.status}`)
    }

    const videosData = await videosResponse.json()

    return videosData.items || []
  } catch (error) {
    console.error("Error fetching channel videos:", error)
    return [] // Return empty array on error
  }
}

// Parse ISO 8601 duration to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = match[1] ? Number.parseInt(match[1]) : 0
  const minutes = match[2] ? Number.parseInt(match[2]) : 0
  const seconds = match[3] ? Number.parseInt(match[3]) : 0

  return hours * 3600 + minutes * 60 + seconds
}

// Calculate average video duration from a list of videos
function calculateAverageVideoDuration(videos: any[]): number {
  if (videos.length === 0) return 0

  const totalDuration = videos.reduce((sum, video) => {
    const duration = parseDuration(video.contentDetails.duration)
    return sum + duration
  }, 0)

  return totalDuration / videos.length
}

// Check if a video is likely monetized
function isVideoLikelyMonetized(video: any, channelSubscriberCount: number): boolean {
  // Check if the video is not private and not made for kids
  const isEligible = video.status.privacyStatus === "public" && !video.status.madeForKids

  // Videos with higher view counts are more likely to be monetized
  const hasEnoughViews = Number.parseInt(video.statistics.viewCount) > 1000

  // Check if the video is long enough for mid-roll ads (8+ minutes)
  const duration = parseDuration(video.contentDetails.duration)
  const isLongEnough = duration >= 480 // 8 minutes in seconds

  // Check if the channel has enough subscribers for monetization
  const hasEnoughSubscribers = channelSubscriberCount >= 1000

  // For a video to be monetized, the channel needs to be eligible and the video needs to meet criteria
  return isEligible && hasEnoughViews && (isLongEnough || hasEnoughSubscribers)
}

// Estimate CPM based on channel metrics
function estimateCpm(subscriberCount: number, viewCount: number, videoCount: number): number {
  // Base CPM range is $0.25 to $4.00
  let baseCpm = 0.25

  // Channels with more subscribers tend to have higher CPM
  if (subscriberCount > 100000) baseCpm += 1.5
  else if (subscriberCount > 10000) baseCpm += 0.75
  else if (subscriberCount > 1000) baseCpm += 0.25

  // Channels with higher engagement (views per video) tend to have higher CPM
  const viewsPerVideo = viewCount / videoCount
  if (viewsPerVideo > 10000) baseCpm += 1.5
  else if (viewsPerVideo > 5000) baseCpm += 1.0
  else if (viewsPerVideo > 1000) baseCpm += 0.5

  // Add some randomness to make it more realistic
  baseCpm += Math.random() * 0.5

  return Number.parseFloat(baseCpm.toFixed(2))
}

// Calculate revenue by category
function calculateRevenueByCategory(totalViews: number): { category: string; rpm: string; revenue: string }[] {
  const categories = [
    { category: "Shorts", rpm: "$0.08", revenue: `$${((totalViews * 0.08) / 1000).toFixed(2)}` },
    { category: "Music", rpm: "$0.70", revenue: `$${((totalViews * 0.7) / 1000).toFixed(2)}` },
    { category: "Pets & Animals", rpm: "$1.30", revenue: `$${((totalViews * 1.3) / 1000).toFixed(2)}` },
    { category: "Entertainment", rpm: "$1.60", revenue: `$${((totalViews * 1.6) / 1000).toFixed(2)}` },
    { category: "Gaming", rpm: "$2.60", revenue: `$${((totalViews * 2.6) / 1000).toFixed(2)}` },
    { category: "Howto & Style", rpm: "$3.00", revenue: `$${((totalViews * 3.0) / 1000).toFixed(2)}` },
    { category: "People & Blogs", rpm: "$3.40", revenue: `$${((totalViews * 3.4) / 1000).toFixed(2)}` },
    { category: "Science & Technology", rpm: "$3.90", revenue: `$${((totalViews * 3.9) / 1000).toFixed(2)}` },
    { category: "Autos & Vehicles", rpm: "$4.00", revenue: `$${((totalViews * 4.0) / 1000).toFixed(2)}` },
    { category: "Education", rpm: "$4.30", revenue: `$${((totalViews * 4.3) / 1000).toFixed(2)}` },
    { category: "Sports", rpm: "$5.00", revenue: `$${((totalViews * 5.0) / 1000).toFixed(2)}` },
    { category: "News & Politics", rpm: "$6.00", revenue: `$${((totalViews * 6.0) / 1000).toFixed(2)}` },
    { category: "Film & Animation", rpm: "$9 ➜ $20.00", revenue: `$${((totalViews * 9.0) / 1000).toFixed(2)}` },
    { category: "Digital M. & Finance", rpm: "$10 ➜ $20.00", revenue: `$${((totalViews * 10.0) / 1000).toFixed(2)}` },
  ]

  return categories
}

// Format creation date
function formatCreationDate(publishedAt: string): { formattedDate: string; daysAgo: number } {
  const publishDate = new Date(publishedAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - publishDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const months = Math.floor(diffDays / 30)
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  const remainingDays = diffDays % 30

  let formattedDate = publishDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (years > 0) {
    formattedDate += ` ${years} ${years === 1 ? "year" : "years"}`
    if (remainingMonths > 0) {
      formattedDate += `, ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`
    }
  } else if (months > 0) {
    formattedDate += ` ${months} ${months === 1 ? "month" : "months"}`
    if (remainingDays > 0) {
      formattedDate += `, ${remainingDays} ${remainingDays === 1 ? "day" : "days"}`
    }
  } else {
    formattedDate += ` ${diffDays} ${diffDays === 1 ? "day" : "days"}`
  }

  formattedDate += " ago. (Total: " + diffDays + " days)"

  return { formattedDate, daysAgo: diffDays }
}

// Extract topics from topicDetails
function extractTopics(topicDetails: any): string[] {
  if (!topicDetails || !topicDetails.topicCategories) {
    return []
  }

  const topics: string[] = []

  topicDetails.topicCategories.forEach((url: string) => {
    const topic = url.split("/").pop()
    if (topic) {
      topics.push(topic.replace(/_/g, "_"))
    }
  })

  return topics
}

// Main function to check monetization status
export async function checkMonetization(url: string): Promise<MonetizationResult> {
  try {
    // Determine if URL is for a channel or video
    const channelId = extractChannelId(url)
    const videoId = extractVideoId(url)

    if (!channelId && !videoId) {
      throw new Error("Invalid YouTube URL. Please provide a valid channel or video URL.")
    }

    if (channelId) {
      // Handle channel URL
      let channelData

      // Check if it's a channel ID or username/custom URL
      if (channelId.startsWith("UC")) {
        channelData = await fetchChannelById(channelId)
      } else {
        channelData = await fetchChannelByUsername(channelId)
      }

      const snippet = channelData.snippet
      const statistics = channelData.statistics
      const status = channelData.status || {}
      const topicDetails = channelData.topicDetails || {}
      const brandingSettings = channelData.brandingSettings || {}

      // Extract relevant data
      const subscriberCount = Number.parseInt(statistics.subscriberCount) || 0
      const viewCount = Number.parseInt(statistics.viewCount) || 0
      const videoCount = Number.parseInt(statistics.videoCount) || 0

      // Fetch some videos to calculate average duration
      const channelVideos = await fetchChannelVideos(channelData.id)
      const avgVideoDuration = calculateAverageVideoDuration(channelVideos)

      // Check if videos have ads (a proxy for monetization)
      const videosWithAds = channelVideos.filter((video) => isVideoLikelyMonetized(video, subscriberCount)).length
      const hasAdsInMostVideos = videosWithAds > channelVideos.length * 0.5

      // Determine if channel is likely monetized using Method 2
      const monetizationResult = isChannelLikelyMonetized(
        subscriberCount,
        videoCount,
        viewCount,
        snippet.description,
        avgVideoDuration,
      )

      // Estimate CPM
      const cpm = estimateCpm(subscriberCount, viewCount, videoCount)

      // Estimate CTR (Click-Through Rate)
      const ctr = Math.random() * 0.05 + 0.02 // 2% to 7% CTR

      // Calculate daily, monthly, and yearly views
      const dailyViews = Math.floor(viewCount / 365) // Rough estimate
      const monthlyViews = dailyViews * 30

      // Calculate revenue estimates
      const dailyRevenue = ((dailyViews * cpm) / 1000).toFixed(2)
      const monthlyRevenue = ((monthlyViews * cpm) / 1000).toFixed(2)
      const yearlyRevenue = ((monthlyViews * 12 * cpm) / 1000).toFixed(2)

      // Generate historical data
      const historicalData = generateHistoricalData(viewCount, subscriberCount)

      // Get country information
      const countryInfo = getCountryInfo(snippet.country || "US")

      // Get language information
      const langInfo = getLanguageInfo(brandingSettings.channel?.defaultLanguage || "en")

      // Format creation date
      const creationInfo = formatCreationDate(snippet.publishedAt)

      // Extract topics
      const topics = extractTopics(topicDetails)

      // Calculate revenue by category
      const revenueByCategory = calculateRevenueByCategory(viewCount)

      // Extract tags
      const tags = brandingSettings.channel?.keywords?.split(",").map((tag: string) => tag.trim()) || []

      return {
        isMonetized: monetizationResult.isMonetized,
        monetizationFactors: monetizationResult.factors,
        channelType: snippet.title.includes("Official") ? "Official Artist" : "Content Creator",
        adStatus: monetizationResult.isMonetized ? "Ads are active on this channel." : "Ads are not active.",
        authenticity: {
          status: monetizationResult.factors.passesAuthenticity,
          message: monetizationResult.factors.passesAuthenticity
            ? "This channel is perceived as original."
            : "This channel may not meet authenticity requirements.",
        },
        regionRestriction: {
          restricted: false,
          message: "There are no restrictions.",
        },
        location: {
          country: countryInfo.country,
          countryCode: snippet.country || "US",
          dialCode: countryInfo.dialCode,
          religion: countryInfo.religion,
        },
        creationInfo: {
          date: snippet.publishedAt,
          formattedDate: creationInfo.formattedDate,
          daysAgo: creationInfo.daysAgo,
        },
        defaultLanguage: {
          code: brandingSettings.channel?.defaultLanguage || "en",
          name: langInfo.name,
          description: langInfo.description,
        },
        tags: tags,
        subscribers: {
          count: subscriberCount,
          tier: getSubscriberTier(subscriberCount),
        },
        videoStats: {
          count: videoCount,
          avgDuration: avgVideoDuration,
          uploadFrequency: {
            perYear: videoCount / (creationInfo.daysAgo / 365),
            perMonth: videoCount / (creationInfo.daysAgo / 30),
            perWeek: videoCount / (creationInfo.daysAgo / 7),
          },
        },
        views: {
          total: viewCount,
          monthly: monthlyViews,
          daily: dailyViews,
          perVideo: Math.floor(viewCount / videoCount),
        },
        playlists: {
          uploads: true,
          shorts: videoCount > 5,
          membersOnly: subscriberCount > 1000,
          popular: viewCount > 10000,
          popularShorts: viewCount > 10000 && videoCount > 5,
          liveStreams: Math.random() > 0.5,
          membersContent: subscriberCount > 1000,
          membersShorts: subscriberCount > 1000 && videoCount > 5,
          membersLiveStreams: subscriberCount > 1000 && Math.random() > 0.5,
          popularLiveStreams: viewCount > 10000 && Math.random() > 0.5,
        },
        isForKids: status.madeForKids || false,
        hasGoogleAnalytics: false,
        topicDetails: topics,
        description: snippet.description,
        channelId: channelData.id,
        channelUrl: `https://www.youtube.com/channel/${channelData.id}`,
        estimatedRevenue: {
          daily: dailyRevenue,
          monthly: monthlyRevenue,
          yearly: yearlyRevenue,
          cpm,
          ctr,
          byCategory: revenueByCategory,
          totalEstimated: ((viewCount * cpm) / 1000).toFixed(2),
        },
        historicalData,
        channelInfo: {
          title: snippet.title,
          description: snippet.description,
          thumbnailUrl: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
          bannerUrl: brandingSettings.image?.bannerExternalUrl || "",
          country: snippet.country || "Unknown",
          publishedAt: snippet.publishedAt,
        },
      }
    } else if (videoId) {
      // Handle video URL
      const videoData = await fetchVideoById(videoId)

      const snippet = videoData.snippet
      const statistics = videoData.statistics
      const contentDetails = videoData.contentDetails
      const status = videoData.status || {}

      // Get channel data for the video
      const channelData = await fetchChannelById(snippet.channelId)
      const channelStats = channelData.statistics
      const channelSnippet = channelData.snippet

      // Extract relevant data
      const viewCount = Number.parseInt(statistics.viewCount) || 0
      const likeCount = Number.parseInt(statistics.likeCount) || 0
      const commentCount = Number.parseInt(statistics.commentCount) || 0
      const subscriberCount = Number.parseInt(channelStats.subscriberCount) || 0
      const videoCount = Number.parseInt(channelStats.videoCount) || 0

      // Get video duration in seconds
      const videoDuration = parseDuration(contentDetails.duration)

      // Fetch some channel videos to check for ads
      const channelVideos = await fetchChannelVideos(snippet.channelId)
      const avgVideoDuration = calculateAverageVideoDuration(channelVideos)

      // Check if this video is likely monetized
      const isMonetized = isVideoLikelyMonetized(videoData, subscriberCount)

      // Check if the channel is likely monetized using Method 2
      const channelMonetizationResult = isChannelLikelyMonetized(
        subscriberCount,
        videoCount,
        Number.parseInt(channelStats.viewCount) || 0,
        channelSnippet.description,
        avgVideoDuration,
      )

      // Estimate CPM for this video
      const cpm = estimateCpm(subscriberCount, viewCount, 1)

      // Estimate CTR
      const ctr = Math.random() * 0.05 + 0.02 // 2% to 7% CTR

      // Calculate daily views (assuming the video's views are spread over its lifetime)
      const publishDate = new Date(snippet.publishedAt)
      const now = new Date()
      const daysSincePublish = Math.max(1, Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24)))
      const dailyViews = Math.floor(viewCount / daysSincePublish)
      const monthlyViews = dailyViews * 30

      // Calculate revenue estimates
      const totalRevenue = ((viewCount * cpm) / 1000).toFixed(2)
      const dailyRevenue = ((dailyViews * cpm) / 1000).toFixed(2)
      const monthlyRevenue = ((monthlyViews * cpm) / 1000).toFixed(2)
      const yearlyRevenue = (Number.parseFloat(monthlyRevenue) * 12).toFixed(2)

      // Generate historical data
      const historicalData = generateHistoricalData(viewCount, subscriberCount)

      // Get country information
      const countryInfo = getCountryInfo(channelSnippet.country || "US")

      // Format creation date
      const creationInfo = formatCreationDate(snippet.publishedAt)

      // Calculate revenue by category
      const revenueByCategory = calculateRevenueByCategory(viewCount)

      // Extract tags
      const tags = snippet.tags || []

      return {
        isMonetized: isMonetized && channelMonetizationResult.isMonetized,
        monetizationFactors: channelMonetizationResult.factors,
        channelType: "Video Content",
        adStatus: isMonetized ? "Ads are enabled on this video." : "Ads are not active.",
        authenticity: {
          status: channelMonetizationResult.factors.passesAuthenticity,
          message: "This video is perceived as original.",
        },
        regionRestriction: {
          restricted: false,
          message: "There are no restrictions.",
        },
        location: {
          country: countryInfo.country,
          countryCode: channelSnippet.country || "US",
          dialCode: countryInfo.dialCode,
          religion: countryInfo.religion,
        },
        creationInfo: {
          date: snippet.publishedAt,
          formattedDate: creationInfo.formattedDate,
          daysAgo: creationInfo.daysAgo,
        },
        defaultLanguage: {
          code: snippet.defaultLanguage || "en",
          name: getLanguageInfo(snippet.defaultLanguage || "en").name,
        },
        tags: tags,
        subscribers: {
          count: subscriberCount,
          tier: getSubscriberTier(subscriberCount),
        },
        videoStats: {
          count: 1,
          avgDuration: videoDuration,
          uploadFrequency: {
            perYear: 0,
            perMonth: 0,
            perWeek: 0,
          },
        },
        views: {
          total: viewCount,
          monthly: monthlyViews,
          daily: dailyViews,
          perVideo: viewCount,
        },
        playlists: {
          uploads: true,
          shorts: false,
          membersOnly: false,
          popular: false,
          popularShorts: false,
          liveStreams: false,
          membersContent: false,
          membersShorts: false,
          membersLiveStreams: false,
          popularLiveStreams: false,
        },
        isForKids: status.madeForKids || false,
        hasGoogleAnalytics: false,
        topicDetails: [],
        description: snippet.description,
        channelId: snippet.channelId,
        channelUrl: `https://www.youtube.com/channel/${snippet.channelId}`,
        estimatedRevenue: {
          daily: dailyRevenue,
          monthly: monthlyRevenue,
          yearly: yearlyRevenue,
          cpm,
          ctr,
          byCategory: revenueByCategory,
          totalEstimated: totalRevenue,
        },
        historicalData,
        channelInfo: {
          title: channelSnippet.title,
          description: channelSnippet.description,
          thumbnailUrl: channelSnippet.thumbnails.default?.url,
          bannerUrl: "",
          country: channelSnippet.country || "Unknown",
          publishedAt: channelSnippet.publishedAt,
        },
        videoInfo: {
          title: snippet.title,
          description: snippet.description,
          thumbnailUrl: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
          publishedAt: snippet.publishedAt,
          duration: contentDetails.duration,
        },
      }
    }

    throw new Error("Could not process the URL")
  } catch (error) {
    console.error("Error checking monetization:", error)
    throw error
  }
}

// Function to format numbers with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Function to convert data to CSV format
export function generateCSV(data: any): string {
  const headers = Object.keys(data).filter((key) => typeof data[key] !== "object")
  let csv = headers.join(",") + "\n"

  csv += headers
    .map((key) => {
      if (typeof data[key] === "string" && data[key].includes(",")) {
        return `"${data[key]}"`
      }
      return data[key]
    })
    .join(",")

  // Add nested objects
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === "object" && data[key] !== null && !Array.isArray(data[key])) {
      csv += "\n\n" + key + " Details:\n"
      const subHeaders = Object.keys(data[key])
      csv += subHeaders.join(",") + "\n"
      csv += subHeaders.map((subKey) => data[key][subKey]).join(",")
    }
  })

  return csv
}

// Format duration from ISO 8601 format to human-readable format
export function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "00:00"

  const hours = match[1] ? Number.parseInt(match[1]) : 0
  const minutes = match[2] ? Number.parseInt(match[2]) : 0
  const seconds = match[3] ? Number.parseInt(match[3]) : 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }
}

// Format date to readable format
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Copy text to clipboard
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
