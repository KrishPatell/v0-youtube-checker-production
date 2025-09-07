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
import { 
  Loader2, 
  Copy, 
  ExternalLink, 
  Calendar, 
  Eye, 
  Heart, 
  MessageCircle, 
  Clock, 
  Download, 
  Share2, 
  Info, 
  HelpCircle,
  Smartphone,
  Monitor,
  Globe,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  FileVideo,
  Music,
  Smartphone as MobileIcon,
  Monitor as DesktopIcon,
  Globe as WebIcon
} from "lucide-react"

interface ShortsData {
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
  formats: {
    quality: string
    format: string
    url: string
    size?: string
  }[]
}

// Draft notice: Temporarily disabled pending compliance review
export default function YouTubeShortsDownloader() {
  const [url, setUrl] = useState("")
  const [shortsData, setShortsData] = useState<ShortsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("downloader")
  const [selectedFormat, setSelectedFormat] = useState<string>("")
  const [downloading, setDownloading] = useState(false)

  const handleExtract = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube Shorts URL")
      return
    }

    setLoading(true)
    setError("")
    setShortsData(null)

    try {
      const response = await fetch('/api/youtube/shorts-downloader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to extract Shorts data')
      }

      const data = await response.json()
      setShortsData(data)
      setActiveTab("results")
      if (data.formats && data.formats.length > 0) {
        setSelectedFormat(data.formats[0].url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract Shorts data")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!selectedFormat) return
    
    setDownloading(true)
    try {
      // Create a temporary link to trigger download
      const link = document.createElement('a')
      link.href = selectedFormat
      
      // Generate a better filename
      const format = shortsData?.formats.find(f => f.url === selectedFormat)
      const quality = format?.quality || 'video'
      const fileFormat = format?.format || 'mp4'
      const title = shortsData?.title || 'youtube-shorts'
      const cleanTitle = title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 50)
      
      link.download = `${cleanTitle}-${quality}.${fileFormat.toLowerCase()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Show success message
      setError("")
      setSuccess("Download started successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Download failed. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  const openShorts = () => {
    if (shortsData?.id) {
      window.open(`https://www.youtube.com/shorts/${shortsData.id}`, "_blank")
    }
  }

  const copyUrl = async () => {
    if (!url) return
    
    try {
      await navigator.clipboard.writeText(url)
      // Show success feedback
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              YouTube Shorts Downloader (Temporarily Unavailable)
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This page was published due to a technical error and has been taken down while we complete our YouTube API Services compliance review. We apologize for the inconvenience.
            </p>
          </div>

          {/* Main Tool disabled intentionally */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full hidden">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="downloader">Shorts Downloader</TabsTrigger>
              <TabsTrigger value="results">Download Results</TabsTrigger>
            </TabsList>

            <TabsContent value="downloader">
              <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-6 w-6 text-blue-600" />
                    Download YouTube Shorts
                  </CardTitle>
                  <CardDescription>
                    Paste any YouTube Shorts URL below to extract and download the video
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* URL Input */}
                  <div className="space-y-2">
                    <label htmlFor="url" className="text-sm font-medium text-gray-700">
                      YouTube Shorts URL
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://www.youtube.com/shorts/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={copyUrl} variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Legal Notice */}
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Legal Notice:</strong> Only download content you own or have permission to use. 
                      Respect copyright laws and YouTube's Terms of Service. This tool is for educational and 
                      personal use only.
                    </AlertDescription>
                  </Alert>
                  
                  {/* Info Notice */}
                  <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>How it works:</strong> This tool extracts real video streams directly from YouTube 
                      using ytdl-core. Downloads are processed in real-time and provide actual video files, not mock URLs.
                    </AlertDescription>
                  </Alert>

                  {/* Download Button */}
                  <Button 
                    onClick={handleExtract} 
                    disabled={loading || !url.trim()} 
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Extracting Video Data...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Extract & Download
                      </>
                    )}
                  </Button>

                  {/* Success Display */}
                  {success && (
                    <Alert className="border-green-200 bg-green-50 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Error Display */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              {shortsData && (
                <div className="space-y-6">
                  {/* Video Info Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileVideo className="h-6 w-6 text-green-600" />
                        {shortsData.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Thumbnail */}
                        <div className="space-y-4">
                          <img 
                            src={shortsData.thumbnailUrl} 
                            alt={shortsData.title}
                            className="w-full rounded-lg shadow-md"
                          />
                          <Button onClick={openShorts} variant="outline" className="w-full">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View on YouTube
                          </Button>
                        </div>

                        {/* Video Details */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900">Channel</h3>
                            <p className="text-gray-600">{shortsData.channelTitle}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Duration</p>
                              <p className="font-medium">{shortsData.duration}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Views</p>
                              <p className="font-medium">{shortsData.viewCount}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Likes</p>
                              <p className="font-medium">{shortsData.likeCount}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Comments</p>
                              <p className="font-medium">{shortsData.commentCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Download Options */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Download className="h-6 w-6 text-blue-600" />
                        Download Options
                      </CardTitle>
                      <CardDescription>
                        Choose your preferred format and quality for download
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {shortsData.formats.map((format, index) => (
                          <div 
                            key={index}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedFormat === format.url 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedFormat(format.url)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary">{format.quality}</Badge>
                                <Badge variant="outline">{format.format}</Badge>
                                {format.size && (
                                  <span className="text-sm text-gray-500">{format.size}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {format.format === 'MP4' && <FileVideo className="h-4 w-4 text-blue-600" />}
                                {format.format === 'MP3' && <Music className="h-4 w-4 text-green-600" />}
                                {format.quality === 'HD' && <Monitor className="h-4 w-4 text-purple-600" />}
                                {format.quality === '4K' && <Zap className="h-4 w-4 text-yellow-600" />}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <Button 
                          onClick={handleDownload} 
                          disabled={!selectedFormat || downloading}
                          className="w-full"
                          size="lg"
                        >
                          {downloading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Download Selected Format
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Our YouTube Shorts Downloader?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real Downloads</h3>
                  <p className="text-gray-600">
                    Uses ytdl-core to extract actual video streams from YouTube. No mock URLs - real working downloads.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">100% Safe</h3>
                  <p className="text-gray-600">
                    No malware, no ads, no tracking. Your privacy and security are our top priorities.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
                  <p className="text-gray-600">
                    Download in MP4, MP3, HD, and Standard quality. Real formats extracted from YouTube.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it legal to download YouTube Shorts?</AccordionTrigger>
                <AccordionContent>
                  Downloading content you own or have permission to use is generally legal. However, 
                  downloading copyrighted content without permission may violate copyright laws. Always 
                  ensure you have the right to download and use the content.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>What formats are supported?</AccordionTrigger>
                <AccordionContent>
                  Our tool supports multiple formats including MP4 (video), MP3 (audio), HD quality, 
                  and 4K resolution. You can choose the format that best suits your needs.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Do I need to create an account?</AccordionTrigger>
                <AccordionContent>
                  No account creation is required. Our YouTube Shorts downloader is completely free 
                  and works instantly without any registration or login.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>How fast are the downloads?</AccordionTrigger>
                <AccordionContent>
                  Download speeds depend on your internet connection and the video size. Most Shorts 
                  download in under 30 seconds. Our servers are optimized for maximum speed.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>Can I download private or age-restricted videos?</AccordionTrigger>
                <AccordionContent>
                  No, our tool can only download publicly available YouTube Shorts. Private, 
                  unlisted, or age-restricted content cannot be accessed due to YouTube's privacy settings.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="pt-8 pb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Download YouTube Shorts?
                </h2>
                <p className="text-blue-100 mb-6 text-lg">
                  Start downloading your favorite YouTube Shorts videos in high quality today!
                </p>
                <Button 
                  onClick={() => setActiveTab("downloader")} 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Start Downloading Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      {/* Tools Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="mt-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-2">YouTube Tools</h2>
            <p className="text-center text-gray-600 mb-8">Explore more free tools to streamline your YouTube workflow</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel ID Finder</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Quickly find the unique ID for any YouTube channel.
                <div className="mt-4">
                  <a href="/tools/youtube/channel-id-finder" className="inline-flex"><Button>Try Now →</Button></a>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Copyright Checker</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Check license, visibility and region restrictions.
                <div className="mt-4">
                  <a href="/tools/youtube/copyright-checker" className="inline-flex"><Button>Try Now →</Button></a>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tag Extractor</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Extract tags from YouTube videos for research and SEO.
                <div className="mt-4">
                  <a href="/tools/youtube-tag-extractor" className="inline-flex"><Button>Try Now →</Button></a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
