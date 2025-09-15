import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, ArrowDown, Minus, ExternalLink, BarChart3, TrendingUp, Eye, MousePointer } from "lucide-react"

export default function RankingDashboard() {
  // Mock data - replace with real data from your analytics
  const primaryKeywords = [
    { keyword: "YouTube monetization checker", position: 3, change: 2, traffic: 1250, url: "/" },
    { keyword: "YouTube monetization requirements 2025", position: 5, change: -1, traffic: 890, url: "/blogs/youtube-monetization-requirements-2025" },
    { keyword: "YouTube Partner Program eligibility", position: 2, change: 3, traffic: 1100, url: "/blogs/youtube-partner-program-eligibility-guide" },
    { keyword: "YouTube RPM vs CPM", position: 4, change: 1, traffic: 750, url: "/blogs/youtube-rpm-cpm-explained" },
    { keyword: "YouTube Shorts monetization", position: 7, change: -2, traffic: 650, url: "/blogs/youtube-shorts-monetization-strategy-2025" },
  ]

  const mediumKeywords = [
    { keyword: "YouTube monetization calculator", position: 8, change: 0, traffic: 420, url: "/blogs/youtube-monetization-calculator-2025" },
    { keyword: "How to check if YouTube channel is monetized", position: 6, change: 2, traffic: 380, url: "/blogs/how-to-check-youtube-channel-monetized" },
    { keyword: "YouTube monetization checker tools 2025", position: 9, change: -1, traffic: 320, url: "/blogs/complete-guide-youtube-monetization-checker-2025" },
    { keyword: "YouTube monetization requirements 1000 subscribers", position: 11, change: 1, traffic: 280, url: "/blogs/youtube-monetization-requirements-2025" },
  ]

  const getPositionColor = (position: number) => {
    if (position <= 3) return "text-green-600"
    if (position <= 10) return "text-yellow-600"
    return "text-red-600"
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-400"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SEO Ranking Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your keyword rankings and SEO performance in real-time
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keywords Tracked</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top 3 Positions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Organic Traffic</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">+0.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Keyword Rankings */}
      <Tabs defaultValue="primary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="primary">Primary Keywords</TabsTrigger>
          <TabsTrigger value="medium">Medium Priority</TabsTrigger>
          <TabsTrigger value="longtail">Long-tail Keywords</TabsTrigger>
        </TabsList>

        <TabsContent value="primary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Primary Keywords Performance</CardTitle>
              <CardDescription>
                High-priority keywords that drive the most traffic to your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {primaryKeywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{keyword.keyword}</h3>
                        <Badge variant="outline" className={getPositionColor(keyword.position)}>
                          Position {keyword.position}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getChangeIcon(keyword.change)}
                          <span className={`text-sm ${getChangeColor(keyword.change)}`}>
                            {keyword.change > 0 ? `+${keyword.change}` : keyword.change}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {keyword.traffic.toLocaleString()} monthly traffic
                        </span>
                        <a 
                          href={keyword.url} 
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Page
                        </a>
                      </div>
                    </div>
                    <div className="w-32">
                      <Progress 
                        value={Math.max(0, 100 - (keyword.position - 1) * 10)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medium" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medium Priority Keywords</CardTitle>
              <CardDescription>
                Secondary keywords that support your primary content strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mediumKeywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{keyword.keyword}</h3>
                        <Badge variant="outline" className={getPositionColor(keyword.position)}>
                          Position {keyword.position}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getChangeIcon(keyword.change)}
                          <span className={`text-sm ${getChangeColor(keyword.change)}`}>
                            {keyword.change > 0 ? `+${keyword.change}` : keyword.change}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {keyword.traffic.toLocaleString()} monthly traffic
                        </span>
                        <a 
                          href={keyword.url} 
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Page
                        </a>
                      </div>
                    </div>
                    <div className="w-32">
                      <Progress 
                        value={Math.max(0, 100 - (keyword.position - 1) * 10)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="longtail" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Long-tail Keywords</CardTitle>
              <CardDescription>
                Specific, longer keyword phrases that often have less competition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Long-tail keyword data will be displayed here once tracking is set up.</p>
                <p className="text-sm mt-2">Add your long-tail keywords to the tracking template to get started.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to improve your SEO performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="https://search.google.com/search-console" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-medium mb-2">Google Search Console</h3>
              <p className="text-sm text-muted-foreground">Check detailed search performance data</p>
            </a>
            <a 
              href="https://analytics.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-medium mb-2">Google Analytics</h3>
              <p className="text-sm text-muted-foreground">View traffic and user behavior data</p>
            </a>
            <a 
              href="/keyword-tracking-template.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-medium mb-2">Download Template</h3>
              <p className="text-sm text-muted-foreground">Get the keyword tracking spreadsheet</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
