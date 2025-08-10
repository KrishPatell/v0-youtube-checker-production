import type { Metadata } from "next"
import { Search, Zap, Copy, BarChart3, Smartphone, RefreshCw, Code, Users, HelpCircle, Shield } from "lucide-react"
import ChannelSearch from "@/components/ChannelSearch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion" // Import Accordion components

export const metadata: Metadata = {
  title: "YouTube Channel ID Finder Tool – Instantly Find Any Channel ID (2025)",
  description:
    "Free YouTube Channel ID Finder—paste URL, handle, or channel name to get the official ID. No signup needed. API‑ready & accurate.",
  canonical: "https://yourdomain.com/tools/youtube/channel-id-finder",
  openGraph: {
    title: "YouTube Channel ID Finder Tool – Instantly Find Any Channel ID (2025)",
    description:
      "Free YouTube Channel ID Finder—paste URL, handle, or channel name to get the official ID. No signup needed. API‑ready & accurate.",
    type: "website",
    url: "https://yourdomain.com/tools/youtube/channel-id-finder",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Channel ID Finder Tool – Instantly Find Any Channel ID (2025)",
    description:
      "Free YouTube Channel ID Finder—paste URL, handle, or channel name to get the official ID. No signup needed. API‑ready & accurate.",
  },
  keywords: "YouTube Channel ID Finder, find channel ID, YouTube API tool, channel ID lookup, YouTube developer tools",
  robots: "index, follow",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "YouTube Channel ID Finder Tool",
  description:
    "Free YouTube Channel ID Finder—paste URL, handle, or channel name to get the official ID. No signup needed. API‑ready & accurate.",
  url: "https://yourdomain.com/tools/youtube/channel-id-finder",
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "YouTube Channel ID Finder",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a YouTube Channel ID?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'A YouTube Channel ID is a unique alphanumeric identifier that starts with "UC" followed by 22 characters. It\'s assigned to every YouTube channel and is essential for API integrations, analytics tools, and developer workflows.',
      },
    },
    {
      "@type": "Question",
      name: "Can I use handles/custom URLs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Our tool accepts YouTube handles (@username), custom URLs (/c/channelname), legacy usernames (/user/username), and direct channel URLs (/channel/UC...).",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a Google API key?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, you don't need your own API key. Our tool handles all the API calls for you using the official YouTube Data API v3.",
      },
    },
    {
      "@type": "Question",
      name: "Is the tool completely free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the basic channel ID lookup is completely free with no signup required. We also offer API access for developers who need programmatic access.",
      },
    },
    {
      "@type": "Question",
      name: "Does it process private channels?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool can find Channel IDs for private channels if you have the direct URL, but it won't display detailed statistics for private channels due to YouTube's privacy settings.",
      },
    },
  ],
}

export default function YouTubeChannelIdFinderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="container max-w-6xl mx-auto px-4 my-[60] py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <Search className="w-12 h-12 text-red-600" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {" "}
              {/* Reduced H1 size */}
              YouTube Channel ID Finder Tool
            </h1>

            <p className="text-gray-600 mb-8 max-w-3xl mx-auto text-lg">
              {" "}
              {/* Reduced subheading size */}
              Enter a YouTube URL, channel name, or handle—get the channel's unique ID in seconds, no sign‑ups or extra
              steps.
            </p>

            <div className="flex justify-center mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                ⚡ Powered by Lighting Fast Data APIs
              </Badge>
            </div>
          </div>

          {/* Tool Section */}
          <div className="mb-16">
            <ChannelSearch />
          </div>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">How Does It Work?</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">What formats are supported?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Paste a full channel URL (/channel/UC…), custom URL (/c/…), handle (/@handle), or type the channel
                    name.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">How fast is the lookup?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Near‑instant results, powered by the official YouTube Data API with real-time processing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Copy className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">What exactly do I get?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    The Channel ID, basic channel info, subscriber count, and one‑click copy functionality.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Why You Need Channel ID */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why YouTube Channel IDs Matter (2025 Update)</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">🔧 API Integration</h3>
                <p className="text-sm text-gray-600">Integration with YouTube Data API v3</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">📊 Analytics Tools</h3>
                <p className="text-sm text-gray-600">Use in analytics, dashboards & third-party tools</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">🔁 Automation</h3>
                <p className="text-sm text-gray-600">Automate creator workflows or CMS imports</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">🔐 Custom APIs</h3>
                <p className="text-sm text-gray-600">Use in custom API calls or preview embeds</p>
              </div>
            </div>
          </section>

          {/* Supported URL Types */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Supported YouTube URL Formats</h2>

            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Direct Channel URLs</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <code className="bg-gray-100 px-2 py-1 rounded">youtube.com/channel/UC...</code>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <code className="bg-gray-100 px-2 py-1 rounded">youtube.com/c/CustomName</code>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Handles & Legacy URLs</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <code className="bg-gray-100 px-2 py-1 rounded">youtube.com/@HandleName</code>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <code className="bg-gray-100 px-2 py-1 rounded">youtube.com/user/Username</code>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Key Features */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">What Makes This Tool Stand Out</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">⚡ Real‑time lookup</h3>
                  <p className="text-sm text-gray-600">Instant results with no delays</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Copy className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">📋 One‑click copy</h3>
                  <p className="text-sm text-gray-600">Copy to clipboard instantly</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">📈 Channel stats</h3>
                  <p className="text-sm text-gray-600">View subscriber and video counts</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">📱 Mobile responsive</h3>
                  <p className="text-sm text-gray-600">Works on all devices</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">🔄 Multiple formats</h3>
                  <p className="text-sm text-gray-600">Accepts URLs, names, or handles</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">👥 No signup needed</h3>
                  <p className="text-sm text-gray-600">Use immediately, no registration</p>
                </div>
              </div>
            </div>
          </section>

          {/* Developer Section */}
          

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>

            <Accordion type="single" collapsible className="w-full">
              <Card className="mb-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold px-6 py-4">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    What is a YouTube Channel ID?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    A YouTube Channel ID is a unique alphanumeric identifier that starts with "UC" followed by 22
                    characters. It's assigned to every YouTube channel and is essential for API integrations, analytics
                    tools, and developer workflows.
                  </AccordionContent>
                </AccordionItem>
              </Card>

              <Card className="mb-4">
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold px-6 py-4">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Can I use handles/custom URLs?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    Yes! Our tool accepts YouTube handles (@username), custom URLs (/c/channelname), legacy usernames
                    (/user/username), and direct channel URLs (/channel/UC...).
                  </AccordionContent>
                </AccordionItem>
              </Card>

              <Card className="mb-4">
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold px-6 py-4">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Do I need a Google API key?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    No, you don't need your own API key. Our tool handles all the API calls for you using the official
                    YouTube Data API v3.
                  </AccordionContent>
                </AccordionItem>
              </Card>

              <Card className="mb-4">
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-semibold px-6 py-4">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Is the tool completely free?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    Yes, the basic channel ID lookup is completely free with no signup required. We also offer API
                    access for developers who need programmatic access.
                  </AccordionContent>
                </AccordionItem>
              </Card>

              <Card className="mb-4">
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-semibold px-6 py-4">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Does it process private channels?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    The tool can find Channel IDs for private channels if you have the direct URL, but it won't display
                    detailed statistics for private channels due to YouTube's privacy settings.
                  </AccordionContent>
                </AccordionItem>
              </Card>

              <Card>
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg font-semibold px-6 py-4">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    How accurate are the results?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    Our tool uses the official YouTube Data API v3, ensuring 100% accuracy for all channel information
                    and IDs returned.
                  </AccordionContent>
                </AccordionItem>
              </Card>
            </Accordion>
          </section>

          {/* Informational Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              What Is a YouTube Channel ID—and Why You'll Need It in 2025
            </h2>

            <Card>
              <CardContent className="p-8">
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 mb-6">
                    A YouTube Channel ID is the unique "UC…" alphanumeric code assigned to every channel. It's essential
                    for reliable API integrations, content automation, and analytics platforms. With evolving AI agents
                    and generative models, being able to map channels to their IDs cleanly is more important than ever.
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Why Channel IDs Matter</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Permanent identifier that never changes</li>
                        <li>• Required for YouTube Data API calls</li>
                        <li>• Essential for analytics and tracking</li>
                        <li>• Used in embed codes and widgets</li>
                        <li>• Critical for automation workflows</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">Common Use Cases</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Building YouTube analytics dashboards</li>
                        <li>• Creating content management systems</li>
                        <li>• Developing creator tools and apps</li>
                        <li>• Setting up automated monitoring</li>
                        <li>• Integrating with third-party platforms</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                    <p className="text-blue-800">
                      <strong>Pro Tip:</strong> Unlike channel names and custom URLs which can change, Channel IDs are
                      permanent. Always use the Channel ID for reliable integrations and avoid broken links in your
                      applications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Legal Notice */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Legal & Privacy</h2>

            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Official API</h3>
                    <p className="text-sm text-gray-600">
                      Uses official YouTube Data API v3 in compliance with Google policies
                    </p>
                  </div>

                  <div>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">No Scraping</h3>
                    <p className="text-sm text-gray-600">
                      No scraping or unauthorized data fetching—only official API calls
                    </p>
                  </div>

                  <div>
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HelpCircle className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Privacy First</h3>
                    <p className="text-sm text-gray-600">
                      We don't store your searches or channel data—everything is processed in real-time
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                  <p>
                    By using this tool, you agree to our{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                    ,{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>
                    , and{" "}
                    <Link href="/cookies" className="text-blue-600 hover:underline">
                      Cookie Policy
                    </Link>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  )
}
