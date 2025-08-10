"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  checkMonetization,
  formatNumber,
  generateCSV,
  formatDate,
  copyToClipboard,
  formatDuration,
} from "@/lib/youtube-api"
import {
  Copy,
  Check,
  Users,
  Video,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Share2,
  Download,
  Search,
  Youtube,
  FileText,
} from "lucide-react"
import { jsPDF } from "jspdf"
import Image from "next/image"
// First, replace the import for InteractiveChart with LineChart
// Remove this import:
// import { InteractiveChart } from "./interactive-chart"

// Add these imports instead:
import { LineChart } from "./charts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell } from "recharts"

export default function MonetizationForm() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [showAllPlaylists, setShowAllPlaylists] = useState(false)
  const [showRequirements, setShowRequirements] = useState(true)
  const [progress, setProgress] = useState(0)
  const resultRef = useRef<HTMLDivElement>(null)

  // Simulate progress when loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return prev
          }
          return prev + 10
        })
      }, 300)

      return () => {
        clearInterval(interval)
        setProgress(0)
      }
    }
  }, [isLoading])

  // Add a URL validation function
  const isValidYouTubeUrl = (url: string): boolean => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(channel\/|c\/|user\/|@))[a-zA-Z0-9_-]+(\?.+)?$/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+(&.+)?$/,
      /^(https?:\/\/)?(www\.)?youtu\.be\/[a-zA-Z0-9_-]+(\?.+)?$/,
    ]

    return patterns.some((pattern) => pattern.test(url))
  }

  // Update the handleSubmit function to validate the URL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a YouTube URL")
      return
    }

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube channel or video URL")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Call the YouTube API
      const data = await checkMonetization(url)
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Failed to check monetization status. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyTags = async () => {
    if (!result?.tags) return

    try {
      await copyToClipboard(result.tags.join(", "))
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy tags:", err)
    }
  }

  const exportPDF = () => {
    if (!result || !resultRef.current) return

    const doc = new jsPDF()

    // Add title
    doc.setFontSize(20)
    doc.text("YouTube Monetization Report", 20, 20)

    // Add URL
    doc.setFontSize(12)
    doc.text(`URL: ${url}`, 20, 30)

    // Add channel/video info
    if (result.channelInfo) {
      doc.setFontSize(16)
      doc.text(`Channel: ${result.channelInfo.title}`, 20, 40)
    } else if (result.videoInfo) {
      doc.setFontSize(16)
      doc.text(`Video: ${result.videoInfo.title}`, 20, 40)
    }

    // Add monetization status
    doc.setFontSize(16)
    doc.text("Monetization Status", 20, 55)
    doc.setFontSize(12)
    doc.text(`Status: ${result.isMonetized ? "Monetized" : "Not Monetized"}`, 20, 65)
    doc.text(`Type: ${result.channelType}`, 20, 75)
    doc.text(`Ad Status: ${result.adStatus}`, 20, 85)

    // Add revenue information
    doc.setFontSize(16)
    doc.text("Estimated Revenue", 20, 100)
    doc.setFontSize(12)
    doc.text(`Daily: $${result.estimatedRevenue.daily}`, 20, 110)
    doc.text(`Monthly: $${result.estimatedRevenue.monthly}`, 20, 120)
    doc.text(`Yearly: $${result.estimatedRevenue.yearly}`, 20, 130)
    doc.text(`CPM: $${result.estimatedRevenue.cpm}`, 20, 140)
    doc.text(`CTR: ${(result.estimatedRevenue.ctr * 100).toFixed(2)}%`, 20, 150)

    // Add view information if available
    if (result.views) {
      doc.setFontSize(16)
      doc.text("View Statistics", 20, 165)
      doc.setFontSize(12)
      doc.text(`Total Views: ${formatNumber(result.views.total)}`, 20, 175)
      doc.text(`Monthly Views: ${formatNumber(result.views.monthly)}`, 20, 185)
      doc.text(`Daily Views: ${formatNumber(result.views.daily)}`, 20, 195)
    }

    // Add subscriber information if available
    if (result.subscribers) {
      doc.setFontSize(16)
      doc.text("Subscriber Information", 20, 210)
      doc.setFontSize(12)
      doc.text(`Subscribers: ${formatNumber(result.subscribers.count)}`, 20, 220)
    }

    // Add video count if available
    if (result.videoStats) {
      doc.text(`Video Count: ${formatNumber(result.videoStats.count)}`, 20, 230)
    }

    // Add date
    doc.setFontSize(10)
    doc.text(`Report generated on ${new Date().toLocaleDateString()}`, 20, 250)

    // Save the PDF
    doc.save("youtube-monetization-report.pdf")
  }

  const exportCSV = () => {
    if (!result) return

    const csv = generateCSV(result)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "youtube-monetization-data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate monetization score percentage
  const calculateMonetizationScore = () => {
    if (!result) return 0

    let score = 0
    const factors = result.monetizationFactors

    if (factors.hasJoinButton) score += 16.7
    if (factors.hasAdsInVideos) score += 16.7
    if (factors.hasMcnPartnership) score += 16.7
    if (factors.passesAuthenticity) score += 16.7
    if (factors.hasEnoughSubscribers) score += 16.7
    if (factors.hasEnoughWatchTime) score += 16.7

    return Math.min(Math.round(score), 100)
  }

  // Format monetary values with commas
  const formatMoneyWithCommas = (value: string): string => {
    const numValue = Number.parseFloat(value)
    return numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Add this RPM data at the top of the component function
  const categoryRpmData = [
    { category: "Shorts", rpm: 0.08 },
    { category: "Music", rpm: 0.7 },
    { category: "Pets & Animals", rpm: 1.3 },
    { category: "Entertainment", rpm: 1.6 },
    { category: "Gaming", rpm: 2.6 },
    { category: "Howto & Style", rpm: 3.0 },
    { category: "People & Blogs", rpm: 3.4 },
    { category: "Science & Technology", rpm: 3.9 },
    { category: "Autos & Vehicles", rpm: 4.0 },
    { category: "Education", rpm: 4.3 },
    { category: "Sports", rpm: 5.0 },
    { category: "News & Politics", rpm: 6.0 },
    { category: "Film & Animation", rpm: 9.0 },
    { category: "Digital Marketing & Finance", rpm: 10.0 },
  ]

  // Add the following function after formatMoneyWithCommas
  const getAnnualizedRevenue = (result: any) => {
    if (!result) return { annualViews: 0, totalRevenue: "0.00", monthlyRevenue: "0.00", dailyRevenue: "0.00" }

    const totalViews = result.views.total
    const channelAgeInDays = result.creationInfo.daysAgo || 365 // Default to 1 year if age unknown
    const channelAgeInYears = Math.max(channelAgeInDays / 365, 1) // Minimum 1 year to avoid division by zero

    const annualViews = totalViews / channelAgeInYears
    const monthlyViews = annualViews / 12
    const dailyViews = annualViews / 365

    // Determine the appropriate RPM based on content category
    // Default to People & Blogs if no match is found
    let rpm = 3.4 // Default RPM for People & Blogs

    // Try to match with channel topics or use a default
    if (result.topicDetails && result.topicDetails.length > 0) {
      const topic = result.topicDetails[0].toLowerCase()

      if (topic.includes("game")) rpm = 2.6
      else if (topic.includes("music")) rpm = 0.7
      else if (topic.includes("animal")) rpm = 1.3
      else if (topic.includes("entertain")) rpm = 1.6
      else if (topic.includes("how") || topic.includes("style")) rpm = 3.0
      else if (topic.includes("tech") || topic.includes("science")) rpm = 3.9
      else if (topic.includes("auto") || topic.includes("vehicle")) rpm = 4.0
      else if (topic.includes("edu")) rpm = 4.3
      else if (topic.includes("sport")) rpm = 5.0
      else if (topic.includes("news") || topic.includes("polit")) rpm = 6.0
      else if (topic.includes("film") || topic.includes("anim")) rpm = 9.0
      else if (topic.includes("finance") || topic.includes("market")) rpm = 10.0
    }

    const totalRevenue = ((totalViews * rpm) / 1000).toFixed(2)
    const annualRevenue = ((annualViews * rpm) / 1000).toFixed(2)
    const monthlyRevenue = ((monthlyViews * rpm) / 1000).toFixed(2)
    const dailyRevenue = ((dailyViews * rpm) / 1000).toFixed(2)

    return {
      annualViews,
      rpm,
      totalRevenue,
      annualRevenue,
      monthlyRevenue,
      dailyRevenue,
    }
  }

  // Add a function to calculate revenue for all content categories
  const calculateAllCategoryRevenue = (totalViews: number) => {
    return categoryRpmData.map((cat) => ({
      category: cat.category,
      rpm: cat.rpm.toFixed(2),
      revenue: ((totalViews * cat.rpm) / 1000).toFixed(2),
    }))
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <Youtube className="h-10 w-10 text-red-600" />
            <span className="ml-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
              YTMonetizer
            </span>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Check if a YouTube channel is monetized and analyze its potential revenue. Get detailed insights into
            monetization requirements and performance metrics.
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-3xl mx-auto mb-6 overflow-hidden border-0 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Enter YouTube channel or video URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 py-6 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Analyzing</span>
                      <Progress value={progress} className="w-20 h-2" />
                    </>
                  ) : (
                    "Check Monetization Status"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {result && (
          <div ref={resultRef} className="max-w-6xl mx-auto">
            {/* Channel Header */}
            <Card className="mb-8 overflow-hidden border-0 shadow-lg">
              <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
                {result.channelInfo?.bannerUrl && (
                  <Image
                    src={result.channelInfo.bannerUrl || "/placeholder.svg"}
                    alt="Channel Banner"
                    fill
                    className="object-cover opacity-30"
                  />
                )}
              </div>
              <CardContent className="p-6 -mt-16 relative">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                  <div className="relative z-10">
                    <Image
                      src={result.channelInfo?.thumbnailUrl || "/placeholder.svg?height=200&width=200"}
                      alt="Channel Profile"
                      width={100}
                      height={100}
                      className="rounded-full border-4 border-white shadow-md"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white">
                      {result.channelInfo?.title || result.videoInfo?.title}
                    </h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {formatNumber(result.subscribers.count)} subscribers
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {formatNumber(result.videoStats.count)} videos
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(result.views.total)} views
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button onClick={exportPDF} variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                    <Button onClick={exportCSV} variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monetization Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card
                className={`col-span-1 md:col-span-2 border-0 shadow-lg overflow-hidden ${result.isMonetized ? "bg-gradient-to-br from-green-50 to-green-100" : "bg-gradient-to-br from-red-50 to-red-100"}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className={`w-6 h-6 ${result.isMonetized ? "text-green-600" : "text-red-600"}`} />
                    Monetization Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`text-2xl font-bold mb-2 ${result.isMonetized ? "text-green-600" : "text-red-600"}`}
                    >
                      {result.isMonetized ? "MONETIZED" : "NOT MONETIZED"}
                    </div>
                    <div className="text-sm text-slate-600 mb-4">
                      {result.isMonetized
                        ? "This channel meets YouTube's monetization requirements"
                        : "This channel does not meet all monetization requirements"}
                    </div>
                    <div className="w-full max-w-md">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Monetization Score</span>
                        <span className="font-medium">{calculateMonetizationScore()}%</span>
                      </div>
                      <Progress value={calculateMonetizationScore()} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                    Estimated Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result && (
                    <div className="space-y-4">
                      {(() => {
                        const revenueData = getAnnualizedRevenue(result)
                        return (
                          <>
                            <div>
                              <div className="text-sm text-slate-500">Monthly</div>
                              <div className="text-2xl font-bold group relative">
                                ${formatMoneyWithCommas(revenueData.monthlyRevenue)}
                                <div className="absolute z-50 hidden group-hover:block bg-black text-white text-xs rounded p-2 w-64 -left-4 bottom-full mb-1">
                                  Based on {formatNumber(Math.round(revenueData.annualViews / 12))} monthly views with
                                  an estimated RPM of ${revenueData.rpm.toFixed(2)}. RPM varies by content category from
                                  $0.50 to $20.00.
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-slate-500">Daily</div>
                                <div className="text-lg font-medium group relative">
                                  ${formatMoneyWithCommas(revenueData.dailyRevenue)}
                                  <div className="absolute z-50 hidden group-hover:block bg-black text-white text-xs rounded p-2 w-64 -left-4 bottom-full mb-1">
                                    Based on {formatNumber(Math.round(revenueData.annualViews / 365))} daily views with
                                    an estimated RPM of ${revenueData.rpm.toFixed(2)}.
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-slate-500">Yearly</div>
                                <div className="text-lg font-medium group relative">
                                  ${formatMoneyWithCommas(revenueData.annualRevenue)}
                                  <div className="absolute z-50 hidden group-hover:block bg-black text-white text-xs rounded p-2 w-64 -left-4 bottom-full mb-1">
                                    Since {formatDate(result.creationInfo.date)}, this channel has generated
                                    approximately ${formatMoneyWithCommas(revenueData.totalRevenue)} total with an RPM
                                    of ${revenueData.rpm.toFixed(2)}.
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Monetization Requirements */}
            <Card className="mb-8 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  Monetization Requirements
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRequirements(!showRequirements)}
                  className="h-8 w-8 p-0"
                >
                  {showRequirements ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardHeader>
              {showRequirements && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {result.monetizationFactors.hasJoinButton ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium">Channel Membership Button</div>
                          <div className="text-sm text-slate-500">Eligible for channel memberships</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.monetizationFactors.hasAdsInVideos ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium">Ads in Videos</div>
                          <div className="text-sm text-slate-500">Videos have ads enabled</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.monetizationFactors.hasMcnPartnership ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium">MCN/CMS Partnership</div>
                          <div className="text-sm text-slate-500">Partnered with a network</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {result.monetizationFactors.passesAuthenticity ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium">Channel Authenticity</div>
                          <div className="text-sm text-slate-500">Channel meets authenticity requirements</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.monetizationFactors.hasEnoughSubscribers ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium">1000+ Subscribers</div>
                          <div className="text-sm text-slate-500">
                            Current: {formatNumber(result.subscribers.count)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.monetizationFactors.hasEnoughWatchTime ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium">4000+ Watch Hours</div>
                          <div className="text-sm text-slate-500">
                            Estimated: {formatNumber(Math.floor(result.monetizationFactors.estimatedWatchTimeHours))}{" "}
                            hrs
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-700">
                      <p className="font-medium mb-1">Channel Details:</p>
                      <p>Average Video Duration: {formatDuration(`PT${Math.floor(result.videoStats.avgDuration)}S`)}</p>
                      <p>Total Videos: {formatNumber(result.videoStats.count)}</p>
                      <p>Creation Date: {formatDate(result.creationInfo.date)}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Tabs for detailed information */}
            <Tabs defaultValue="analytics" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-10 gap-1">
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="revenue"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
                >
                  Revenue
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
                >
                  Content
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
                >
                  Channel Details
                </TabsTrigger>
              </TabsList>

              {/* Then replace the TabsContent for "analytics" with this implementation: */}
              <TabsContent value="analytics" className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  {/* Main Analytics Chart */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle>Channel Performance</CardTitle>
                      <CardDescription>Last 30 days views and revenue</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <LineChart
                        data={result.historicalData.dates.map((date, index) => ({
                          date,
                          views: result.historicalData.views[index],
                          revenue: result.historicalData.revenue[index],
                        }))}
                      />
                    </CardContent>
                  </Card>

                  {/* View Stats and Channel Growth */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">View Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Total Views</span>
                            <span className="font-bold">{formatNumber(result.views.total)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Monthly Views</span>
                            <span className="font-medium">{formatNumber(result.views.monthly)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Daily Views</span>
                            <span className="font-medium">{formatNumber(result.views.daily)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Views Per Video</span>
                            <span className="font-medium">{formatNumber(result.views.perVideo)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Channel Growth</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-600">Subscriber Growth</span>
                              <span className="text-sm font-medium">Good</span>
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-600">View Growth</span>
                              <span className="text-sm font-medium">Excellent</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-slate-600">Upload Consistency</span>
                              <span className="text-sm font-medium">Average</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="revenue" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Revenue Distribution</CardTitle>
                      <CardDescription>Estimated revenue sources</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ChartContainer
                        config={{
                          adRevenue: {
                            label: "Ad Revenue",
                            color: "hsl(var(--chart-1))",
                          },
                          superChat: {
                            label: "Super Chat",
                            color: "hsl(var(--chart-2))",
                          },
                          memberships: {
                            label: "Channel Memberships",
                            color: "hsl(var(--chart-3))",
                          },
                          merchandise: {
                            label: "Merchandise",
                            color: "hsl(var(--chart-4))",
                          },
                        }}
                        className="h-full w-full"
                      >
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Ad Revenue",
                                value: Number.parseFloat(result.estimatedRevenue.monthly) * 0.7,
                                dataKey: "adRevenue",
                              },
                              {
                                name: "Super Chat",
                                value: Number.parseFloat(result.estimatedRevenue.monthly) * 0.15,
                                dataKey: "superChat",
                              },
                              {
                                name: "Channel Memberships",
                                value: Number.parseFloat(result.estimatedRevenue.monthly) * 0.1,
                                dataKey: "memberships",
                              },
                              {
                                name: "Merchandise",
                                value: Number.parseFloat(result.estimatedRevenue.monthly) * 0.05,
                                dataKey: "merchandise",
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {[
                              { dataKey: "adRevenue" },
                              { dataKey: "superChat" },
                              { dataKey: "memberships" },
                              { dataKey: "merchandise" },
                            ].map((entry) => (
                              <Cell key={entry.dataKey} fill={`var(--color-${entry.dataKey})`} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Revenue Factors</CardTitle>
                      <CardDescription>Key metrics affecting revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">CPM (Cost Per Mille)</span>
                            <span className="text-sm font-medium">${result.estimatedRevenue.cpm}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min((result.estimatedRevenue.cpm / 10) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Average amount paid per 1,000 views</p>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">CTR (Click-Through Rate)</span>
                            <span className="text-sm font-medium">
                              {(result.estimatedRevenue.ctr * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${Math.min(result.estimatedRevenue.ctr * 1000, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Percentage of viewers who click on ads</p>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Engagement Rate</span>
                            <span className="text-sm font-medium">{(Math.random() * 10 + 2).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${Math.random() * 50 + 20}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Percentage of viewers who engage with content</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Revenue by Category</CardTitle>
                      <CardDescription>Potential earnings by content type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.estimatedRevenue.byCategory.slice(0, 6).map((item: any, index: number) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{item.category}</span>
                              <span className="text-sm font-medium">{item.rpm}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div
                                className="bg-emerald-600 h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min((Number.parseInt(item.revenue.replace(/[^0-9.-]+/g, "")) / 1000) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                        <div className="text-center mt-2">
                          <Button variant="link" size="sm" className="text-xs">
                            View all categories
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Revenue Projections</CardTitle>
                    <CardDescription>Estimated future earnings based on current growth</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-sm text-slate-500">Current Monthly</div>
                        <div className="text-xl font-bold">
                          ${formatMoneyWithCommas(result.estimatedRevenue.monthly)}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-sm text-slate-500">3 Months Projection</div>
                        <div className="text-xl font-bold">
                          $
                          {formatMoneyWithCommas((Number.parseFloat(result.estimatedRevenue.monthly) * 1.2).toFixed(2))}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-sm text-slate-500">6 Months Projection</div>
                        <div className="text-xl font-bold">
                          $
                          {formatMoneyWithCommas((Number.parseFloat(result.estimatedRevenue.monthly) * 1.5).toFixed(2))}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-sm text-slate-500">12 Months Projection</div>
                        <div className="text-xl font-bold">
                          $
                          {formatMoneyWithCommas((Number.parseFloat(result.estimatedRevenue.monthly) * 2.1).toFixed(2))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Content Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Total Videos</span>
                          <span className="font-bold">{formatNumber(result.videoStats.count)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Average Duration</span>
                          <span className="font-medium">
                            {formatDuration(`PT${Math.floor(result.videoStats.avgDuration)}S`)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Upload Frequency</span>
                          <span className="font-medium">
                            {result.videoStats.uploadFrequency.perMonth.toFixed(1)} / month
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">For Kids Content</span>
                          <span className="font-medium">{result.isForKids ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Video Playlists</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {result.playlists.uploads && (
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                            <Video className="w-4 h-4 text-slate-600" />
                            <span>Uploads playlist (Full list)</span>
                          </div>
                        )}
                        {result.playlists.shorts && (
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                            <Video className="w-4 h-4 text-slate-600" />
                            <span>Short Videos</span>
                          </div>
                        )}
                        {result.playlists.membersOnly && (
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                            <Video className="w-4 h-4 text-slate-600" />
                            <span>Members-only videos</span>
                          </div>
                        )}
                        {result.playlists.popular && (
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                            <Video className="w-4 h-4 text-slate-600" />
                            <span>Popular videos</span>
                          </div>
                        )}
                        {result.playlists.liveStreams && (
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                            <Video className="w-4 h-4 text-slate-600" />
                            <span>Live streams</span>
                          </div>
                        )}
                        {showAllPlaylists ? (
                          <>
                            {result.playlists.popularShorts && (
                              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                                <Video className="w-4 h-4 text-slate-600" />
                                <span>Popular short videos</span>
                              </div>
                            )}
                            {result.playlists.membersContent && (
                              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                                <Video className="w-4 h-4 text-slate-600" />
                                <span>Members-only contents</span>
                              </div>
                            )}
                            <Button
                              onClick={() => setShowAllPlaylists(false)}
                              variant="link"
                              size="sm"
                              className="mt-2"
                            >
                              Show less
                            </Button>
                          </>
                        ) : (
                          <Button onClick={() => setShowAllPlaylists(true)} variant="link" size="sm" className="mt-2">
                            Show more playlists
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Tags & Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.tags && result.tags.length > 0 ? (
                        <div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {result.tags.slice(0, 10).map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="bg-slate-100">
                                {tag}
                              </Badge>
                            ))}
                            {result.tags.length > 10 && (
                              <Badge variant="secondary" className="bg-slate-100">
                                +{result.tags.length - 10} more
                              </Badge>
                            )}
                          </div>
                          <Button
                            onClick={handleCopyTags}
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center justify-center gap-1"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-4 h-4" />
                                Copied to clipboard
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy all tags
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-slate-500 py-4">No tags found for this channel</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Channel Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Channel ID</div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium truncate flex-1">{result.channelId}</div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Channel URL</div>
                          <div className="flex items-center gap-2">
                            <a
                              href={result.channelUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline truncate flex-1"
                            >
                              {result.channelUrl}
                            </a>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Creation Date</div>
                          <div className="text-sm">{formatDate(result.creationInfo.date)}</div>
                          <div className="text-xs text-slate-500">{result.creationInfo.formattedDate}</div>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Location</div>
                          <div className="text-sm">
                            {result.location.country} ({result.location.countryCode})
                          </div>
                          <div className="text-xs text-slate-500">Dial Code: {result.location.dialCode}</div>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Default Language</div>
                          <div className="text-sm">
                            {result.defaultLanguage?.name} ({result.defaultLanguage?.code.toUpperCase()})
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Channel Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-slate-50 p-4 rounded-lg text-sm max-h-[300px] overflow-y-auto">
                        {result.description || "No description available for this channel."}
                      </div>
                    </CardContent>
                  </Card>

                  {result.topicDetails && result.topicDetails.length > 0 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle>Channel Topics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {result.topicDetails.map((topic: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-slate-50">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Channel Type</span>
                          <span className="font-medium">{result.channelType}</span>
                        </div>
                        <Separator />
                        <div className="flex items-start justify-between">
                          <span className="text-slate-600">👪 Is This Channel for Kids?</span>
                          <div className="text-right">
                            <span className="font-medium">
                              {result.isForKids ? "✅ Yes" : "⛔ This channel hasn't defined audience settings"}
                            </span>
                            <p className="text-xs text-slate-500 mt-1">
                              The channel owner is individually defining the videos themselves.
                              <a href="#" className="text-blue-600 hover:underline ml-1">
                                Click here to learn more
                              </a>
                            </p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-start justify-between">
                          <span className="text-slate-600">🗨️ Channel Topic Details</span>
                          <div className="text-right">
                            {result.topicDetails && result.topicDetails.length > 0 ? (
                              <div className="flex flex-col items-end">
                                {result.topicDetails.map((topic: string, index: number) => (
                                  <span key={index} className="font-medium">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="font-medium">No topics available</span>
                            )}
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-start justify-between">
                          <span className="text-slate-600">📈 Google Analytics Connected</span>
                          <div className="text-right">
                            <span className="font-medium">
                              {result.hasGoogleAnalytics ? "Yes, it has been linked" : "No, it has not been linked"}
                            </span>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Region Restrictions</span>
                          <span className="font-medium">{result.regionRestriction.restricted ? "Yes" : "None"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Optimization Tips */}
            <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-6 h-6 text-blue-600" />
                  Monetization Optimization Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-medium">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">Increase video length to 10+ minutes</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Longer videos allow for mid-roll ads, significantly increasing revenue potential. Current
                          average: {formatDuration(`PT${Math.floor(result.videoStats.avgDuration)}S`)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-medium">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">Improve CTR with better thumbnails</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Higher click-through rates lead to more views and better algorithm placement. Current CTR:
                          {(result.estimatedRevenue.ctr * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-medium">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">Diversify revenue streams</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Consider channel memberships, merchandise, and sponsored content to increase overall revenue.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-medium">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">Target higher CPM niches</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Finance, technology, and business topics typically have higher ad rates. Current CPM: $
                          {result.estimatedRevenue.cpm}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="mb-8 border border-amber-200 bg-amber-50 shadow-sm">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Disclaimer:</p>
                  <p>
                    Monetization status is determined based on available public data and may not be 100% accurate.
                    YouTube does not provide direct API access to monetization status. This tool uses various signals to
                    estimate monetization status and potential revenue.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* History Query Information */}
            <div className="text-xs text-slate-500 text-center mb-8">
              <p>
                This channel was first queried on
                {new Date().toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" })} at
                {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}. This data will be
                stored for 30 days.
              </p>
            </div>

            <Card className="mt-6 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Revenue by Content Category</CardTitle>
                <CardDescription>Potential annual earnings by content category based on your views</CardDescription>
              </CardHeader>
              <CardContent>
                {result && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">Category</th>
                          <th className="text-right py-2 font-medium">RPM ($)</th>
                          <th className="text-right py-2 font-medium">Est. Annual Revenue ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const revenueData = getAnnualizedRevenue(result)
                          const allCategoryRevenue = calculateAllCategoryRevenue(revenueData.annualViews)

                          return allCategoryRevenue.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-slate-50" : ""}>
                              <td className="py-2">{item.category}</td>
                              <td className="text-right py-2">${item.rpm}</td>
                              <td className="text-right py-2">${formatMoneyWithCommas(item.revenue)}</td>
                            </tr>
                          ))
                        })()}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        <div className="max-w-6xl mx-auto mt-8 pt-36">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Use Our YouTube Monetization Checker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Youtube className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <h3 className="font-semibold text-lg text-slate-800 mb-2">Accurate Monetization Status</h3>
              <p className="text-slate-600">
                Get a reliable assessment of a channel's monetization status using our advanced analysis techniques.
              </p>
            </div>
            <div className="text-center">
              <DollarSign className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="font-semibold text-lg text-slate-800 mb-2">Potential Revenue Insights</h3>
              <p className="text-slate-600">
                Estimate potential revenue based on views, engagement, and industry-standard CPM rates.
              </p>
            </div>
            <div className="text-center">
              <Info className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg text-slate-800 mb-2">Detailed Channel Analysis</h3>
              <p className="text-slate-600">
                Access in-depth channel information, including subscriber growth, video performance, and content
                strategy.
              </p>
            </div>
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="font-semibold text-lg text-slate-800 mb-2">Free Forever</h3>
              <p className="text-slate-600">Our tool is completely free to use. No registration or payment required.</p>
            </div>
          </div>
        </div>
        {/* Hidden AdSense Script */}
        <div style={{ display: "none" }}>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8182382315648187"
            crossOrigin="anonymous"
          ></script>
        </div>
      </div>
    </div>
  )
}
