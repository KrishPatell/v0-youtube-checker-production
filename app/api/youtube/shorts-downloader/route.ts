import { NextRequest, NextResponse } from 'next/server'
import ytdl from 'ytdl-core'
import { extractShortsId, formatDuration, formatViewCount } from '@/lib/youtube-shorts-downloader'

// Function to get real download formats using ytdl-core
async function getRealDownloadFormats(url: string) {
  try {
    const info = await ytdl.getInfo(url)
    
    // Get video formats
    const videoFormats = ytdl.filterFormats(info.formats, 'video')
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly')
    
    const formats = []
    
    // Add best video formats
    const bestVideo = ytdl.chooseFormat(info.formats, { quality: 'highest' })
    if (bestVideo) {
      formats.push({
        quality: 'HD',
        format: 'MP4',
        url: bestVideo.url,
        size: bestVideo.contentLength ? `${Math.round(bestVideo.contentLength / 1024 / 1024)} MB` : 'Unknown'
      })
    }
    
    // Add medium quality video
    const mediumVideo = ytdl.chooseFormat(info.formats, { quality: 'medium' })
    if (mediumVideo && mediumVideo !== bestVideo) {
      formats.push({
        quality: 'Standard',
        format: 'MP4',
        url: mediumVideo.url,
        size: mediumVideo.contentLength ? `${Math.round(mediumVideo.contentLength / 1024 / 1024)} MB` : 'Unknown'
      })
    }
    
    // Add best audio format
    const bestAudio = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' })
    if (bestAudio) {
      formats.push({
        quality: 'Audio Only',
        format: 'MP3',
        url: bestAudio.url,
        size: bestAudio.contentLength ? `${Math.round(bestAudio.contentLength / 1024 / 1024)} MB` : 'Unknown'
      })
    }
    
    return formats
  } catch (error) {
    console.error('Error getting download formats:', error)
    // Fallback to basic formats if ytdl fails
    return [
      {
        quality: 'HD',
        format: 'MP4',
        url: url,
        size: 'Unknown'
      }
    ]
  }
}

// Function to fetch video data from YouTube API
async function fetchVideoData(videoId: string, originalUrl: string) {
  const apiKey = process.env.YOUTUBE_API_KEY
  
  if (!apiKey) {
    throw new Error('YouTube API key not configured')
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics,contentDetails&key=${apiKey}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch video data from YouTube API')
  }

  const data = await response.json()
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Video not found')
  }

  const video = data.items[0]
  const snippet = video.snippet
  const statistics = video.statistics
  const contentDetails = video.contentDetails

  // Get real download formats using ytdl-core
  const formats = await getRealDownloadFormats(originalUrl)
  
  return {
    id: videoId,
    title: snippet.title,
    description: snippet.description,
    thumbnailUrl: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url,
    publishedAt: snippet.publishedAt,
    duration: formatDuration(contentDetails.duration),
    viewCount: formatViewCount(statistics.viewCount || '0'),
    likeCount: formatViewCount(statistics.likeCount || '0'),
    commentCount: formatViewCount(statistics.commentCount || '0'),
    channelTitle: snippet.channelTitle,
    channelId: snippet.channelId,
    formats: formats
  }
}



export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Extract video ID from URL
    const videoId = extractShortsId(url)
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube Shorts URL. Please enter a valid YouTube Shorts URL.' },
        { status: 400 }
      )
    }

    // Fetch video data from YouTube API
    const videoData = await fetchVideoData(videoId, url)

    return NextResponse.json(videoData)
  } catch (error) {
    console.error('Error in Shorts downloader API:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
