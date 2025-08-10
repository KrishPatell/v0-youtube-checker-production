"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2, Copy, ExternalLink, Calendar, Eye, Heart, MessageCircle, Clock, Tag, Youtube, TrendingUp, Users, Target, Zap, BookOpen, Lightbulb, CheckCircle, ArrowRight, Star, BarChart3, Search, Filter, Download, Share2, Info, HelpCircle } from "lucide-react"
import { formatDuration, formatNumber, formatDate } from "@/lib/youtube-tag-extractor"

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
  channelTitle: string
  channelId: string
  categoryId: string
  defaultLanguage: string
  defaultAudioLanguage: string
}

export default function YouTubeTagExtractor() {
  const [url, setUrl] = useState("")
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedTags, setCopiedTags] = useState(false)
  const [activeTab, setActiveTab] = useState("extractor")

  const handleExtract = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    setLoading(true)
    setError("")
    setVideoData(null)

    try {
      const response = await fetch('/api/youtube/tag-extractor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to extract video data')
      }

      const data = await response.json()
      setVideoData(data)
      setActiveTab("results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract video data")
    } finally {
      setLoading(false)
    }
  }

  const copyTagsToClipboard = async () => {
    if (!videoData?.tags) return
    
    try {
      await navigator.clipboard.writeText(videoData.tags.join(", "))
      setCopiedTags(true)
      setTimeout(() => setCopiedTags(false), 2000)
    } catch (err) {
      console.error("Failed to copy tags:", err)
    }
  }

  const openVideo = () => {
    if (videoData?.id) {
      window.open(`https://www.youtube.com/watch?v=${videoData.id}`, "_blank")
    }
  }

  const downloadTags = () => {
    if (!videoData?.tags) return
    
    const content = `YouTube Tags for: ${videoData.title}\n\n${videoData.tags.join(", ")}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `youtube-tags-${videoData.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 bg-red-100 rounded-full">
            <Youtube className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-center sm:text-left">
            YouTube Tag Extractor
          </h1>
        </div>
        <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
          Extract real video information, statistics, and generate relevant tags from any YouTube video URL. 
          Boost your video discoverability with our advanced tag analysis tool.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-gray-500 px-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Real-time data extraction</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Advanced tag generation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>100% free to use</span>
          </div>
        </div>
      </div>

      {/* Main Tool Section */}
      <div className="w-full max-w-full overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12 sm:mb-16 w-full">
        <TabsList className="flex flex-col sm:grid w-full sm:grid-cols-3 mb-8 sm:mb-10 gap-3 sm:gap-2 [&>*]:min-w-0 overflow-hidden">
          <TabsTrigger value="extractor" className="flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base py-4 sm:py-3 px-4 sm:px-4 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 overflow-hidden rounded-lg">
            <Search className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Tag Extractor</span>
            <span className="sm:hidden truncate">Extract</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base py-4 sm:py-3 px-4 sm:px-4 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 overflow-hidden rounded-lg">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Results</span>
            <span className="sm:hidden truncate">Results</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base py-4 sm:py-3 px-4 sm:px-4 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 overflow-hidden rounded-lg">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline truncate">How to Use</span>
            <span className="sm:hidden truncate">Guide</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="extractor">
          <Card className="mb-10">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-2xl leading-tight">
                <Youtube className="h-6 w-6 text-red-600" />
                Extract Video Data & Tags
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Paste a YouTube video URL to extract real video information and generate relevant tags for better discoverability
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex flex-col gap-4 w-full">
                  <Input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full text-base py-3"
                  />
                  <div className="flex flex-row gap-3 w-full">
                    <Button 
                      onClick={handleExtract} 
                      disabled={loading || !url.trim()}
                      className="flex-1 py-3 text-sm"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          <span className="hidden sm:inline">Extracting...</span>
                          <span className="sm:hidden">Extract</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Extract Tags</span>
                          <span className="sm:hidden">Extract</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Quick Examples */}
                <div className="text-sm text-gray-500">
                  <p className="mb-3 leading-relaxed">Quick examples:</p>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                    {[
                      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                      "https://youtu.be/dQw4w9WgXcQ",
                      "https://www.youtube.com/embed/dQw4w9WgXcQ"
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setUrl(example)}
                        className="text-blue-600 hover:text-blue-800 underline text-xs leading-relaxed text-center sm:text-left"
                      >
                        {example.split('//')[1].split('/')[0]}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {error && (
            <Alert className="mb-6">
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {videoData && (
            <div className="space-y-6">
              {/* Video Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-col gap-4">
                    <span>Video Information & Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    {/* Video Details */}
                    <div className="space-y-4 w-full">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{videoData.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {videoData.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Published: {formatDate(videoData.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Duration: {formatDuration(videoData.duration)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Eye className="h-4 w-4" />
                          <span>Views: {formatNumber(videoData.viewCount)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Heart className="h-4 w-4" />
                          <span>Likes: {formatNumber(videoData.likeCount)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MessageCircle className="h-4 w-4" />
                          <span>Comments: {formatNumber(videoData.commentCount)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>Channel: {videoData.channelTitle}</span>
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="flex justify-center">
                      {videoData.thumbnailUrl && (
                        <img
                          src={videoData.thumbnailUrl}
                          alt={videoData.title}
                          className="rounded-lg max-w-full h-auto max-h-48 object-cover shadow-lg"
                        />
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row gap-3 w-full pt-4">
                      <Button variant="outline" size="sm" onClick={openVideo} className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Video
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadTags} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Tags
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-col gap-4">
                    <span className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Generated Tags ({videoData.tags.length})
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Relevant tags extracted from video title, description, and category for optimal discoverability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap gap-2">
                      {videoData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-row gap-3 w-full pt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={copyTagsToClipboard}
                        className="flex-1"
                      >
                        {copiedTags ? (
                          "Copied!"
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy All
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={downloadTags}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                How to Use YouTube Tag Extractor
              </CardTitle>
              <CardDescription>
                Learn how to effectively use our tool to extract and optimize YouTube video tags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold text-xl">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Paste YouTube URL</h3>
                    <p className="text-sm text-gray-600">Copy and paste any YouTube video URL into the input field</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold text-xl">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Extract Data</h3>
                    <p className="text-sm text-gray-600">Click "Extract Tags" to analyze the video and generate relevant tags</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold text-xl">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Use Tags</h3>
                    <p className="text-sm text-gray-600">Copy, download, or use the generated tags for your videos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>

      {/* Educational Content Section */}
      <div className="space-y-12">
        {/* Why Use Tags Section */}
        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-2xl leading-tight">
              <Target className="h-6 w-6 text-blue-600" />
              Why YouTube Tags Matter for Video Success
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold leading-relaxed">🎯 Improve Discoverability</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tags help YouTube's algorithm understand your video content, making it more likely to appear in search results and recommendations.
                </p>
                
                <h3 className="text-lg font-semibold leading-relaxed">📈 Boost Views & Engagement</h3>
                <p className="text-gray-600 leading-relaxed">
                  Better discoverability leads to more views, likes, comments, and subscribers for your channel.
                </p>
                
                <h3 className="text-lg font-semibold leading-relaxed">🔍 Target Relevant Audience</h3>
                <p className="text-gray-600 leading-relaxed">
                  Strategic tags help you reach viewers who are genuinely interested in your content.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold leading-relaxed">⚡ Algorithm Optimization</h3>
                <p className="text-gray-600 leading-relaxed">
                  YouTube's AI uses tags to categorize and recommend your videos to the right audience segments.
                </p>
                
                <h3 className="text-lg font-semibold leading-relaxed">📊 Competitive Advantage</h3>
                <p className="text-gray-600 leading-relaxed">
                  Well-optimized tags give you an edge over competitors in your niche.
                </p>
                
                <h3 className="text-lg font-semibold leading-relaxed">🚀 Long-term Growth</h3>
                <p className="text-gray-600 leading-relaxed">
                  Consistent tag optimization builds sustainable channel growth and audience retention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices Section */}
        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-2xl leading-tight">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
              YouTube Tag Optimization Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-600 leading-relaxed">✅ Do's</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3 leading-relaxed">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Use 5-15 relevant tags per video</span>
                    </li>
                    <li className="flex items-start gap-3 leading-relaxed">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Include both broad and specific terms</span>
                    </li>
                    <li className="flex items-start gap-3 leading-relaxed">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Research trending tags in your niche</span>
                    </li>
                    <li className="flex items-start gap-3 leading-relaxed">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Use tags that match your video content</span>
                    </li>
                    <li className="flex items-start gap-3 leading-relaxed">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Include your channel name as a tag</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-red-600 leading-relaxed">❌ Don'ts</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3 leading-relaxed">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>Don't use misleading or irrelevant tags</span>
                    </li>
                    <li className="flex items-start gap-3 leading-relaxed">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>Avoid overstuffing with too many tags</span>
                    </li>
                    <li className="flex items-start gap-3 leading-relaxed">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>Don't copy tags from competitors blindly</span>
                    </li>
                    <li className="flex items-start gap-3 leading-relaxed">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>Avoid using only generic, broad terms</span>
                    </li>
                    <li className="flex items-start gap-3 leading-relaxed">
                      <span className="text-red-500 font-bold">✗</span>
                      <span>Don't use tags that violate YouTube policies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              Advanced YouTube Tag Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Keyword Research & Analysis</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>Use tools like Google Trends, YouTube Analytics, and our tag extractor to identify high-performing keywords in your niche.</p>
                    <p>Analyze competitor videos to understand what tags are working well for similar content.</p>
                    <p>Look for long-tail keywords that have lower competition but higher intent.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Seasonal & Trending Tags</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>Incorporate seasonal tags that are relevant to your content (holidays, events, seasons).</p>
                    <p>Stay updated with trending topics and hashtags in your industry.</p>
                    <p>Use current events and news-related tags when appropriate for your content.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Audience Targeting</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>Use demographic-specific tags to target your ideal audience (age groups, interests, locations).</p>
                    <p>Include tags that reflect your audience's pain points and interests.</p>
                    <p>Use language and cultural tags that resonate with your target demographic.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Performance Optimization</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>Regularly update your tags based on performance analytics and changing trends.</p>
                    <p>Test different tag combinations to see which ones drive the most engagement.</p>
                    <p>Use A/B testing for tags to optimize your video performance over time.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-indigo-600" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger className="text-left">
                  How many tags should I use for my YouTube videos?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600">
                    YouTube allows up to 500 characters for tags, but it's recommended to use 5-15 relevant tags. Focus on quality over quantity, ensuring each tag accurately describes your content and helps with discoverability.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-2">
                <AccordionTrigger className="text-left">
                  Do tags really affect YouTube SEO and rankings?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600">
                    Yes, tags are one of the many factors that influence YouTube's algorithm. While they're not the most important ranking factor, they help YouTube understand your content and can improve your video's discoverability in search results and recommendations.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-3">
                <AccordionTrigger className="text-left">
                  Should I use the same tags for all my videos?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600">
                    No, you should customize tags for each video based on its specific content. While you can reuse some relevant tags, each video should have unique tags that accurately describe its particular topic, style, and target audience.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-4">
                <AccordionTrigger className="text-left">
                  How often should I update my video tags?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600">
                    It's good practice to review and update your tags every few months or when you notice changes in trending topics or your content strategy. However, avoid changing tags too frequently as it can confuse YouTube's algorithm.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-5">
                <AccordionTrigger className="text-left">
                  Can I see what tags other YouTubers are using?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600">
                    YouTube doesn't publicly display the tags used on videos. However, you can use our tag extractor tool to analyze videos and get insights into potential tag strategies, or use browser extensions that can reveal some tag information.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Optimize Your YouTube Videos?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Start using our YouTube Tag Extractor today to improve your video discoverability, 
                reach more viewers, and grow your channel faster.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setActiveTab("extractor")}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Start Extracting Tags Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
