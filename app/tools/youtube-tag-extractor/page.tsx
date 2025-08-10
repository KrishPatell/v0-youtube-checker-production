"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink, Youtube, Search, Tag, Eye, Clock, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

interface VideoData {
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
}

export default function YouTubeTagExtractor() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [error, setError] = useState("")
  const [copiedTags, setCopiedTags] = useState(false)

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^\"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setVideoData(null)

    if (!url.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    const videoId = extractVideoId(url)
    if (!videoId) {
      setError("Please enter a valid YouTube URL")
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call - replace with actual YouTube API integration
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock data for demonstration - replace with actual API response
      const mockData: VideoData = {
        id: videoId,
        title: "How to Build a Successful YouTube Channel in 2025",
        description: "Learn the essential strategies and techniques to grow your YouTube channel and increase your subscriber count in 2025.",
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        publishedAt: "2025-01-15",
        duration: "15:32",
        viewCount: "125,430",
        likeCount: "8,921",
        commentCount: "1,234",
        tags: [
          "YouTube growth",
          "content creation",
          "subscriber growth",
          "YouTube algorithm",
          "video optimization",
          "thumbnail design",
          "SEO strategies",
          "audience engagement",
          "monetization",
          "brand building",
          "social media marketing",
          "digital marketing",
          "content strategy",
          "video editing",
          "YouTube tips"
        ]
      }
      
      setVideoData(mockData)
    } catch (err) {
      setError("Failed to fetch video data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyTagsToClipboard = async () => {
    if (!videoData?.tags) return
    
    try {
      await navigator.clipboard.writeText(videoData.tags.join(", "))
      setCopiedTags(true)
      setTimeout(() => setCopiedTags(false), 2000)
    } catch (err) {
      console.error("Failed to copy tags")
    }
  }

  const openVideo = () => {
    if (videoData) {
      window.open(`https://www.youtube.com/watch?v=${videoData.id}`, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-3 rounded-full">
                <Tag className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              YouTube Tag Extractor
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Extract video tags from any YouTube video to boost your SEO and discover trending keywords
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Input Form */}
          <Card className="mb-8 shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Extract Video Tags
              </CardTitle>
              <CardDescription className="text-gray-600">
                Paste any YouTube video URL below to extract its tags and metadata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Extracting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Extract Tags
                      </div>
                    )}
                  </Button>
                </div>
                
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {videoData && (
            <div className="space-y-6">
              {/* Video Info Card */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Video Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <img
                        src={videoData.thumbnailUrl}
                        alt={videoData.title}
                        className="w-full rounded-lg shadow-md"
                      />
                      <Button
                        onClick={openVideo}
                        variant="outline"
                        className="w-full mt-3 border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch on YouTube
                      </Button>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg mb-2">
                          {videoData.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {videoData.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Eye className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                          <div className="text-sm font-medium text-gray-800">{videoData.viewCount}</div>
                          <div className="text-xs text-gray-500">Views</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                          <div className="text-sm font-medium text-gray-800">{videoData.likeCount}</div>
                          <div className="text-xs text-gray-500">Likes</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Tag className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                          <div className="text-sm font-medium text-gray-800">{videoData.commentCount}</div>
                          <div className="text-xs text-gray-500">Comments</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Clock className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                          <div className="text-sm font-medium text-gray-800">{videoData.duration}</div>
                          <div className="text-xs text-gray-500">Duration</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags Card */}
              <Card className="shadow-lg border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      Extracted Tags
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {videoData.tags.length} tags found • Click to copy all tags
                    </CardDescription>
                  </div>
                  <Button
                    onClick={copyTagsToClipboard}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {copiedTags ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Copied!
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Copy className="h-4 w-4" />
                        Copy All Tags
                      </div>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {videoData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-2 text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                        onClick={() => navigator.clipboard.writeText(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Why Use Our YouTube Tag Extractor?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">SEO Optimization</h3>
                <p className="text-gray-600">
                  Discover trending keywords and tags to improve your video's search visibility
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Content Research</h3>
                <p className="text-gray-600">
                  Analyze successful videos to understand what tags work best in your niche
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Instant Results</h3>
                <p className="text-gray-600">
                  Get comprehensive tag analysis in seconds with our fast and reliable tool
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
