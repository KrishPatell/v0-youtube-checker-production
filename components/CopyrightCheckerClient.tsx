"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, Globe, Film, AlertTriangle } from "lucide-react"

type ApiResponse = {
  success: boolean
  error?: string
  copyright?: { license: string; licensedContent: boolean }
  visibility?: { privacyStatus: string; embeddable: boolean; publicStatsViewable: boolean }
  contentDetails?: {
    duration: string
    durationFormatted: string
    definition: string
    dimension: string
    captions: boolean
    projection: string
    madeForKids: boolean
  }
  regionRestrictions?: { blocked?: string[]; allowed?: string[] }
}

export default function CopyrightCheckerClient() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch(`/api/youtube/copyright-checker?url=${encodeURIComponent(url)}`)
      const json: ApiResponse = await res.json()
      if (!json.success) throw new Error(json.error || "Failed")
      setData(json)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-3">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL or video ID (e.g. https://youtube.com/watch?v=...)"
            />
            <Button type="submit" disabled={loading || !url}>
              {loading ? "Checking..." : "Check"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-8">
          <CardContent className="p-6 text-red-700">{error}</CardContent>
        </Card>
      )}

      {data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              YouTube Copyright Checker Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Copyright Status</h3>
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="text-gray-500">License:</span> {data.copyright?.license || "youtube"}
                  </p>
                  <p>
                    <span className="text-gray-500">Licensed Content:</span> {data.copyright?.licensedContent ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Globe className="w-4 h-4" /> Visibility</h3>
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="text-gray-500">Privacy Status:</span> {data.visibility?.privacyStatus}
                  </p>
                  <p>
                    <span className="text-gray-500">Embeddable:</span> {data.visibility?.embeddable ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="text-gray-500">Public Stats Viewable:</span> {data.visibility?.publicStatsViewable ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Film className="w-4 h-4" /> Content Details</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="text-gray-500">Duration:</span> {data.contentDetails?.durationFormatted}
                  </p>
                  <p>
                    <span className="text-gray-500">Definition:</span> {data.contentDetails?.definition}
                  </p>
                  <p>
                    <span className="text-gray-500">Dimension:</span> {data.contentDetails?.dimension}
                  </p>
                  <p>
                    <span className="text-gray-500">Captions:</span> {data.contentDetails?.captions ? "Available" : "Not available"}
                  </p>
                  <p>
                    <span className="text-gray-500">Projection:</span> {data.contentDetails?.projection}
                  </p>
                  <p>
                    <span className="text-gray-500">Made for Kids:</span> {data.contentDetails?.madeForKids ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Region Restrictions</h3>
                <div className="text-sm text-gray-700">
                  {data.regionRestrictions?.blocked && data.regionRestrictions.blocked.length > 0 ? (
                    <p>
                      This video is blocked in: {data.regionRestrictions.blocked.join(", ")}
                    </p>
                  ) : (
                    <p>This video is not blocked in any countries.</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}


