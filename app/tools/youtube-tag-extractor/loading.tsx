import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-3 rounded-full">
                <div className="h-8 w-8 bg-white/30 rounded"></div>
              </div>
            </div>
            <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-8 w-2/3 mx-auto mb-8 bg-white/20" />
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-24 bg-white/20" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Input Form Skeleton */}
          <Card className="mb-8 shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <Skeleton className="h-8 w-48 mx-auto mb-2" />
              <Skeleton className="h-5 w-80 mx-auto" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Section Skeleton */}
          <div className="mt-16">
            <Skeleton className="h-10 w-80 mx-auto mb-12" />
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
