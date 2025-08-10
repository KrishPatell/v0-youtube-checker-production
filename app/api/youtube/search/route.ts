import { type NextRequest, NextResponse } from "next/server"
import { searchChannels, getChannelInfo, isValidChannelId } from "@/lib/youtube"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const channelId = searchParams.get("channelId")

    if (!query && !channelId) {
      return NextResponse.json({ success: false, error: "Query or channelId parameter is required" }, { status: 400 })
    }

    let result

    if (channelId) {
      if (!isValidChannelId(channelId)) {
        return NextResponse.json({ success: false, error: "Invalid channel ID format" }, { status: 400 })
      }
      result = await getChannelInfo(channelId)
    } else if (query) {
      result = await searchChannels(query)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, channelId } = body

    if (!query && !channelId) {
      return NextResponse.json({ success: false, error: "Query or channelId is required" }, { status: 400 })
    }

    let result

    if (channelId) {
      if (!isValidChannelId(channelId)) {
        return NextResponse.json({ success: false, error: "Invalid channel ID format" }, { status: 400 })
      }
      result = await getChannelInfo(channelId)
    } else if (query) {
      result = await searchChannels(query)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
