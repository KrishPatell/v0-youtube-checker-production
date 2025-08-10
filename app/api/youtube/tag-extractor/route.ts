import { NextRequest, NextResponse } from 'next/server'
import { extractVideoId, fetchVideoData, generateRelevantTags } from '@/lib/youtube-tag-extractor'

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
    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL. Please enter a valid YouTube video URL.' },
        { status: 400 }
      )
    }

    // Fetch video data from YouTube API
    const videoData = await fetchVideoData(videoId)
    
    // Generate relevant tags
    const tags = generateRelevantTags(videoData)

    // Return the complete video data with generated tags
    const result = {
      ...videoData,
      tags
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in tag extractor API:', error)
    
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
