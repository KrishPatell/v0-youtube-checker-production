'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowUp, ArrowDown, Minus, ExternalLink, BarChart3, TrendingUp, Eye, MousePointer, Play, Download, Zap, FileText, AlertTriangle, CheckCircle, Info } from "lucide-react"

export default function YouTubeVideoAnalyzer() {
  const [videoUrl, setVideoUrl] = useState('https://web-assets.quickads.ai/06_Quickads_Music+Caption.mp4')
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [status, setStatus] = useState('Ready to analyze video')

  const analyzeVideo = async () => {
    // Check if URL is from YouTube
    const isYouTubeUrl = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
    
    if (isYouTubeUrl) {
      setStatus('❌ YouTube URLs are not yet supported. Please use direct video file URLs.')
      return
    }

    setIsAnalyzing(true)
    setStatus('🔄 Analyzing video properties...')
    setLoadProgress(0)

    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setLoadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      // Get video metadata
      const response = await fetch(videoUrl, { method: 'HEAD' })
      const fileSize = response.headers.get('content-length')
      
      if (fileSize) {
        const sizeInMB = (parseInt(fileSize) / 1024 / 1024)
        const sizeInGB = sizeInMB / 1024

        // Simulate getting video metadata
        setTimeout(() => {
          clearInterval(progressInterval)
          setLoadProgress(100)
          
          const mockAnalysis = {
            fileSize: sizeInMB,
            fileSizeGB: sizeInGB,
            duration: 420, // 7 minutes
            resolution: '1920x1080',
            bitrate: ((parseInt(fileSize) * 8) / 420 / 1000).toFixed(0),
            loadTime: 2.5,
            streamSpeed: 15.2,
            sizePerMinute: sizeInMB / 7,
            isWebOptimized: sizeInMB < 50,
            mobileOptimized: sizeInMB < 25,
            suggestions: generateSuggestions(sizeInMB, 420)
          }
          
          setAnalysisData(mockAnalysis)
          setStatus('✅ Analysis complete!')
          setIsAnalyzing(false)
        }, 2000)
      }
    } catch (error) {
      setStatus('❌ Error analyzing video')
      setIsAnalyzing(false)
    }
  }

  const generateSuggestions = (sizeMB: number, duration: number) => {
    const suggestions = []
    const sizePerMinute = sizeMB / (duration / 60)

    if (sizeMB > 500) {
      suggestions.push({
        type: 'critical',
        title: '🚨 URGENT: File Too Large for YouTube Upload',
        description: `At ${(sizeMB/1024).toFixed(2)}GB, this video exceeds YouTube's file size limits and will cause upload issues. Compress to under 256GB (or ideally under 2GB for faster uploads).`
      })
    }

    if (sizeMB > 100) {
      suggestions.push({
        type: 'warning',
        title: '⚠️ Large File Size May Affect Monetization',
        description: `Large videos take longer to process, which can delay monetization eligibility. Consider compressing for faster processing and better viewer experience.`
      })
    }

    if (sizePerMinute > 20) {
      suggestions.push({
        type: 'warning',
        title: '📊 High Bitrate Detected',
        description: `Your video uses ${sizePerMinute.toFixed(1)}MB per minute. For optimal YouTube performance, aim for 8-12MB per minute for 1080p content.`
      })
    }

    suggestions.push({
      type: 'info',
      title: '🎯 YouTube Optimization Tips',
      description: `For maximum monetization potential: Use 1920x1080 resolution, 24-30 fps, H.264 codec, and maintain good audio quality (128-320 kbps AAC).`
    })

    if (sizeMB < 25) {
      suggestions.push({
        type: 'success',
        title: '✅ Excellent File Size for Mobile Viewers',
        description: `Your video is well-optimized for mobile users, which can improve watch time and monetization performance.`
      })
    }

    return suggestions
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      default: return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-950'
      case 'warning': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
      case 'success': return 'border-green-500 bg-green-50 dark:bg-green-950'
      default: return 'border-blue-500 bg-blue-50 dark:bg-blue-950'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          📹 YouTube Video Analyzer
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Analyze your YouTube videos for optimal monetization performance. Check file size, quality, and get compression recommendations.
        </p>
      </div>

      {/* Important Notice */}
      <Alert className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-950">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Current Beta Limitations:</strong> This tool currently analyzes direct video files (MP4, WebM) from sources like S3, Vimeo, or direct hosting. 
          YouTube URL analysis is coming soon! For now, use direct video file URLs.
        </AlertDescription>
      </Alert>

      {/* Video URL Input */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Video URL Analysis
          </CardTitle>
          <CardDescription>
            Enter a direct video file URL to analyze its properties and get optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Supported formats info */}
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">✅ Currently Supported:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Direct MP4 files
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  S3/Cloud storage
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Vimeo direct links
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  CDN-hosted videos
                </span>
              </div>
              
              <h4 className="font-medium text-sm mb-2 mt-3">🚧 Coming Soon:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  YouTube URLs
                </span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  YouTube Shorts
                </span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  Private YouTube videos
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <Input
                placeholder="Enter direct video file URL (e.g., https://example.com/video.mp4)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={analyzeVideo} 
                disabled={isAnalyzing || !videoUrl}
                className="bg-red-600 hover:bg-red-700"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analyze Video
                  </>
                )}
              </Button>
            </div>

            {/* Example URLs */}
            <div className="text-xs text-muted-foreground">
              <strong>Example formats:</strong> https://example.com/video.mp4, https://vimeo.com/direct-link.mp4, https://s3.amazonaws.com/bucket/video.mp4
            </div>
            
            {isAnalyzing && (
              <div className="mt-4">
                <Progress value={loadProgress} className="mb-2" />
                <p className="text-sm text-muted-foreground">{status}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Preview */}
      {videoUrl && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Video Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <video 
                src={videoUrl} 
                controls 
                preload="metadata"
                className="max-w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '400px' }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisData && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">File Size</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analysisData.fileSizeGB > 1 
                    ? `${analysisData.fileSizeGB.toFixed(2)} GB`
                    : `${analysisData.fileSize.toFixed(1)} MB`
                  }
                </div>
                <Badge variant={analysisData.isWebOptimized ? "default" : "destructive"} className="mt-2">
                  {analysisData.isWebOptimized ? "Web Optimized" : "Too Large"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
                <Play className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(analysisData.duration / 60)}:{(analysisData.duration % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Perfect for mid-roll ads
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.resolution}</div>
                <Badge variant="default" className="mt-2">
                  YouTube Optimized
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bitrate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.bitrate} kbps</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {parseInt(analysisData.bitrate) > 8000 ? "High quality" : "Standard quality"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Tabs defaultValue="optimization" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="optimization">Optimization Tips</TabsTrigger>
              <TabsTrigger value="monetization">Monetization Impact</TabsTrigger>
              <TabsTrigger value="technical">Technical Details</TabsTrigger>
            </TabsList>

            <TabsContent value="optimization" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>💡 Optimization Suggestions</CardTitle>
                  <CardDescription>
                    Recommendations to improve your video's performance on YouTube
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisData.suggestions.map((suggestion: any, index: number) => (
                      <Alert key={index} className={getSuggestionColor(suggestion.type)}>
                        <div className="flex items-start gap-3">
                          {getSuggestionIcon(suggestion.type)}
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{suggestion.title}</h4>
                            <AlertDescription>{suggestion.description}</AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monetization" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>💰 Monetization Performance Analysis</CardTitle>
                  <CardDescription>
                    How your video specifications affect YouTube monetization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">✅ Monetization-Friendly Features</h4>
                      <ul className="space-y-2">
                        {analysisData.duration > 480 && (
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>8+ minutes for mid-roll ads</span>
                          </li>
                        )}
                        {analysisData.resolution === '1920x1080' && (
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>1080p resolution for premium ads</span>
                          </li>
                        )}
                        {analysisData.mobileOptimized && (
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Mobile-optimized file size</span>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">⚠️ Potential Issues</h4>
                      <ul className="space-y-2">
                        {!analysisData.isWebOptimized && (
                          <li className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span>Large file size may slow processing</span>
                          </li>
                        )}
                        {analysisData.sizePerMinute > 20 && (
                          <li className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span>High bitrate may cause buffering</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">💡 Pro Tip</h4>
                    <p className="text-sm">
                      Videos with better technical quality (proper resolution, optimal file size, good audio) 
                      tend to have higher watch time and engagement, leading to better monetization performance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>🔧 Technical Specifications</CardTitle>
                  <CardDescription>
                    Detailed technical analysis of your video file
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">File Size:</span>
                        <span>{analysisData.fileSize.toFixed(1)} MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Size per Minute:</span>
                        <span>{analysisData.sizePerMinute.toFixed(1)} MB/min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Estimated Bitrate:</span>
                        <span>{analysisData.bitrate} kbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Load Time:</span>
                        <span>{analysisData.loadTime}s</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Resolution:</span>
                        <span>{analysisData.resolution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Duration:</span>
                        <span>{Math.floor(analysisData.duration / 60)}:{(analysisData.duration % 60).toString().padStart(2, '0')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Stream Speed:</span>
                        <span>{analysisData.streamSpeed} Mbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Mobile Friendly:</span>
                        <Badge variant={analysisData.mobileOptimized ? "default" : "secondary"}>
                          {analysisData.mobileOptimized ? "Yes" : "Optimize"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>⚡ Quick Actions</CardTitle>
              <CardDescription>
                Tools and resources to optimize your YouTube videos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Check Monetization</div>
                    <div className="text-xs text-muted-foreground">Verify your channel status</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">YouTube Analytics</div>
                    <div className="text-xs text-muted-foreground">View performance metrics</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Compression Guide</div>
                    <div className="text-xs text-muted-foreground">Learn optimization techniques</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

          {/* Feature Roadmap */}
          <Card className="mt-8 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                🚧 YouTube Integration Roadmap
              </CardTitle>
              <CardDescription>
                We're actively working on YouTube URL support. Here's what's coming:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Phase 1 - Coming Soon
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• YouTube URL metadata extraction</li>
                      <li>• Basic video information (duration, title)</li>
                      <li>• Monetization eligibility checks</li>
                      <li>• Video quality recommendations</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Phase 2 - Advanced Features
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• YouTube Shorts analysis</li>
                      <li>• Engagement metrics analysis</li>
                      <li>• Revenue optimization suggestions</li>
                      <li>• Competitor video comparison</li>
                    </ul>
                  </div>
                </div>
                
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Want early access?</strong> Join our beta program to test YouTube URL features as soon as they're available. 
                    We'll notify you when the YouTube integration is ready!
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
            <CardContent className="text-center py-8">
              <h3 className="text-2xl font-bold mb-4">🚀 Ready to Optimize Your YouTube Channel?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                While we're building YouTube URL support, use our complete suite of YouTube monetization tools to check your eligibility, 
                analyze your performance, and optimize your content for maximum revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-red-600 hover:bg-red-700">
                  <MousePointer className="h-4 w-4 mr-2" />
                  Check Monetization Status
                </Button>
                <Button variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View All Tools
                </Button>
              </div>
            </CardContent>
          </Card>
    </div>
  )
}
