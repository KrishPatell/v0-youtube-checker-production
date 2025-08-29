import { Loader2, Download } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Download className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Loading YouTube Shorts Downloader
        </h2>
        <p className="text-gray-600 mb-6">
          Preparing your download tool...
        </p>
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </div>
    </div>
  )
}

