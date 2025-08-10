"use client"

import type React from "react"

import { useState } from "react"
import { Search, Copy, ExternalLink, Users, Video, Eye, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ChannelInfo } from "@/lib/youtube"

interface SearchState {
  loading: boolean
  channel: ChannelInfo | null
  error: string | null
  copied: boolean
}

export default function ChannelSearch() {
  const [query, setQuery] = useState("")
  const [state, setState] = useState<SearchState>({
    loading: false,
    channel: null,
    error: null,
    copied: false,
  })

  const handleSearch = async () => {
    if (!query.trim()) return

    setState((prev) => ({ ...prev, loading: true, error: null, channel: null }))

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query.trim())}`)
      const result = await response.json()

      if (result.success && result.channel) {
        setState((prev) => ({ ...prev, loading: false, channel: result.channel, error: null }))
      } else {
        setState((prev) => ({ ...prev, loading: false, error: result.error || "Channel not found", channel: null }))
      }
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: "Failed to search. Please try again.", channel: null }))
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setState((prev) => ({ ...prev, copied: true }))
      setTimeout(() => setState((prev) => ({ ...prev, copied: false })), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Test examples for different channel types
  const testExamples = [
    { label: "MKBHD", query: "@mkbhd" },
    { label: "Google Developers", query: "Google Developers" },
    { label: "Direct URL", query: "https://www.youtube.com/channel/UCBJycsmduvYEL83R_U4JriQ" },
    { label: "Custom URL", query: "https://www.youtube.com/c/mkbhd" },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Input */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter YouTube URL, channel name, or @handle"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg h-12"
                disabled={state.loading}
              />
            </div>
            <Button onClick={handleSearch} disabled={state.loading || !query.trim()} size="lg" className="px-8">
              {state.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {state.loading ? "Searching..." : "Find Channel ID"}
            </Button>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Examples: https://youtube.com/@mkbhd, https://youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw, or "Google
              Developers"
            </p>

            {/* Quick Test Examples */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Quick test:</span>
              {testExamples.map((example) => (
                <Button
                  key={example.label}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs bg-transparent"
                  onClick={() => setQuery(example.query)}
                  disabled={state.loading}
                >
                  {example.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {state.channel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Channel Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Channel Info */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={state.channel.thumbnail || "/placeholder.svg?height=96&width=96"}
                  alt={state.channel.title}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-semibold">{state.channel.title}</h3>
                  {state.channel.handle && <p className="text-muted-foreground">{state.channel.handle}</p>}
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{state.channel.subscriberCount} subscribers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    <span>{state.channel.videoCount} videos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{state.channel.viewCount} views</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://youtube.com/channel/${state.channel!.id}`, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Channel
                  </Button>
                </div>
              </div>
            </div>

            {/* Channel ID Display */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Channel ID</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-lg font-mono bg-background px-2 py-1 rounded border">{state.channel.id}</code>
                    <Badge variant="secondary">UC Format</Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(state.channel!.id)}
                  className={state.copied ? "text-green-600" : ""}
                >
                  {state.copied ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {state.copied ? "Copied!" : "Copy ID"}
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            {state.channel.description && (
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">{state.channel.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
