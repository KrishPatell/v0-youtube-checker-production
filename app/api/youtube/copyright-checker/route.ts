import { type NextRequest, NextResponse } from "next/server"
import { formatDuration } from "@/lib/youtube-api"

const API_KEY = "AIzaSyAfvI_lxSrphIIZ9OIX-WKaQykJM7KSB5s"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

function extractVideoId(input: string): string | null {
  const url = input.trim()
  let match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/)
  if (match) return match[1]
  // If a bare ID was provided
  if (/^[A-Za-z0-9_-]{6,}$/.test(url)) return url
  return null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")
    if (!url) {
      return NextResponse.json({ success: false, error: "Missing url parameter" }, { status: 400 })
    }

    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json({ success: false, error: "Invalid YouTube URL or ID" }, { status: 400 })
    }

    const res = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails,status&id=${videoId}&key=${API_KEY}`,
      { cache: "no-store" },
    )
    if (!res.ok) {
      return NextResponse.json({ success: false, error: `YouTube API error: ${res.status}` }, { status: 502 })
    }
    const data = await res.json()
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 })
    }

    const video = data.items[0]
    const status = video.status || {}
    const contentDetails = video.contentDetails || {}
    const statistics = video.statistics || {}

    const region = contentDetails.regionRestriction || {}
    const blocked: string[] = region.blocked || []
    const allowed: string[] = region.allowed || []

    const payload = {
      success: true,
      videoId,
      title: video.snippet?.title || "",
      thumbnails: video.snippet?.thumbnails || {},
      copyright: {
        license: status.license || "youtube",
        licensedContent: Boolean(contentDetails.licensedContent),
      },
      visibility: {
        privacyStatus: status.privacyStatus || "public",
        embeddable: Boolean(status.embeddable),
        publicStatsViewable: Boolean(status.publicStatsViewable),
      },
      contentDetails: {
        duration: contentDetails.duration || "PT0S",
        durationFormatted: formatDuration(contentDetails.duration || "PT0S"),
        definition: contentDetails.definition || "hd",
        dimension: contentDetails.dimension || "2d",
        captions: contentDetails.caption === "true",
        projection: contentDetails.projection || "rectangular",
        madeForKids: Boolean(status.madeForKids),
      },
      regionRestrictions: {
        blocked,
        allowed,
      },
      stats: {
        viewCount: Number.parseInt(statistics.viewCount || "0"),
        likeCount: Number.parseInt(statistics.likeCount || "0"),
        commentCount: Number.parseInt(statistics.commentCount || "0"),
      },
    }

    return NextResponse.json(payload)
  } catch (err) {
    console.error("Copyright checker error", err)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}


