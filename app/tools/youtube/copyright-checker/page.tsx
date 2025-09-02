import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, Rocket, Zap, FileSearch, UsersRound, Database, Clock3, Info, Shield, Globe, HelpCircle } from "lucide-react"
import CopyrightCheckerClient from "@/components/CopyrightCheckerClient"

export const metadata: Metadata = {
  title: "YouTube Copyright Checker – Check License, Visibility, and Restrictions",
  description: "Paste a YouTube URL to check copyright license, visibility, captions, made for kids, and region restrictions.",
}
export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="container max-w-5xl mx-auto px-4 py-10">
        {/* SEO JSON-LD (FAQ) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What does the YouTube Copyright Checker show?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "It displays official metadata via YouTube Data API: license type, whether content is licensed, privacy status, embeddability, captions availability, made-for-kids flag, definition, dimension and region restrictions.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does this tool detect Content ID matches?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "No. Content ID and claim details are not available in the public Data API. We surface public video fields that influence copyright‑related visibility and usage.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I check region blocks for a YouTube video?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Yes. If the API reports regionRestriction, the tool lists blocked or explicitly allowed countries for the video.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is the checker free to use?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, the tool is free and requires no login.",
                  },
                },
              ],
            }),
          }}
        />
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <Search className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">YouTube Copyright Checker</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">Check a YouTube video's copyright license, visibility, captions, made-for-kids status, and region restrictions using the official YouTube Data API.</p>
          <div className="flex justify-center mt-4">
            <Badge variant="secondary">Uses official YouTube Data API v3</Badge>
          </div>
        </div>

        <CopyrightCheckerClient />

        {/* How It Works */}
        <section className="mt-16 mb-10">
          <h2 className="text-3xl font-bold text-center mb-2">How It Works</h2>
          <p className="text-center text-gray-600 mb-8">Simple steps to verify a YouTube video's copyright‑related details</p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                  <FileSearch className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-[1.2rem]">Enter Video URL</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 pb-3">Paste any YouTube video link or ID. We fetch official details instantly using the YouTube Data API.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Rocket className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-[1.2rem]">Initiate Scan</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 pb-3">Click “Check”. We analyze visibility, license, captions, made‑for‑kids status, and more.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-[1.2rem]">Get Results</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 pb-3">Receive a clean report with clearly labeled sections and friendly explanations.</CardContent>
            </Card>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-center mb-2">Key Features</h2>
          <p className="text-center text-gray-600 mb-8">What makes our Copyright Checker helpful</p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-[1.2rem]">Official Data Only</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 pb-3">Powered solely by the YouTube Data API—no scraping, no third‑party guesswork.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                  <Clock3 className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-[1.2rem]">Fast & Efficient</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 pb-3">Near‑instant responses with a minimal, elegant UI designed for speed.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-3">
                  <Info className="w-6 h-6 text-sky-600" />
                </div>
                <CardTitle className="text-[1.2rem]">Clear, Actionable Output</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 pb-3">Readable labels for license, embeddability, captions, and region blocks—no jargon.</CardContent>
            </Card>
          </div>
        </section>

        {/* Supported YouTube URL Formats */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-center mb-2">Supported YouTube URL Formats</h2>
          <div className="mt-6">
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Standard Video URLs</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <code className="bg-gray-100 px-2 py-1 rounded">youtube.com/watch?v=VIDEO_ID</code>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <code className="bg-gray-100 px-2 py-1 rounded">youtu.be/VIDEO_ID</code>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Embeds & Shorts</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <code className="bg-gray-100 px-2 py-1 rounded">youtube.com/embed/VIDEO_ID</code>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <code className="bg-gray-100 px-2 py-1 rounded">youtube.com/shorts/VIDEO_ID</code>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What Makes This Tool Stand Out */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What Makes This Tool Stand Out</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real‑time lookup</h3>
                <p className="text-sm text-gray-600">Instant results with no delays</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Official API data</h3>
                <p className="text-sm text-gray-600">Pulled directly from YouTube Data API v3</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Region visibility</h3>
                <p className="text-sm text-gray-600">See blocked/allowed countries when available</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <Card className="mb-4">
              <AccordionItem value="faq-1">
                <AccordionTrigger className="text-lg font-semibold px-6 py-4">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Does this tool detect copyright strikes or claims?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  No. Strike and claim data are not exposed by the public YouTube Data API. This tool reports official public fields like license, privacy, embeddability, captions and region restrictions.
                </AccordionContent>
              </AccordionItem>
            </Card>
            <Card className="mb-4">
              <AccordionItem value="faq-2">
                <AccordionTrigger className="text-lg font-semibold px-6 py-4">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  What does the “Licensed content” field mean?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  It’s a boolean provided by YouTube indicating whether the video content is licensed. It does not reveal the licensor or the terms.
                </AccordionContent>
              </AccordionItem>
            </Card>
            <Card className="mb-4">
              <AccordionItem value="faq-3">
                <AccordionTrigger className="text-lg font-semibold px-6 py-4">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Can I use this to see if a video is embeddable on my site?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Yes. The API exposes an embeddable flag; if false, the video cannot be embedded due to owner settings.
                </AccordionContent>
              </AccordionItem>
            </Card>
            <Card className="mb-4">
              <AccordionItem value="faq-4">
                <AccordionTrigger className="text-lg font-semibold px-6 py-4">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Does it work with Shorts links and embed URLs?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Yes. We support standard `watch?v=`, `youtu.be`, `embed`, and `shorts` URL formats.
                </AccordionContent>
              </AccordionItem>
            </Card>
            <Card>
              <AccordionItem value="faq-5">
                <AccordionTrigger className="text-lg font-semibold px-6 py-4">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Is this tool free and do I need to log in?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  The checker is free and requires no login. Results are fetched in real time using our API key server‑side.
                </AccordionContent>
              </AccordionItem>
            </Card>
          </Accordion>
        </section>

        {/* Who Can Benefit */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-2">Who Can Benefit</h2>
          <p className="text-center text-gray-600 mb-8">Useful for anyone working with YouTube content</p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                  <UsersRound className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-[1.2rem]">Creators & Editors</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 pb-3">Check videos before publishing to avoid surprises with visibility or restrictions.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <UsersRound className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-[1.2rem]">Agencies & Brands</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 pb-3">Quick compliance checks across multiple client videos.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                  <UsersRound className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-[1.2rem]">Researchers</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 pb-3">Audit public metadata at scale for studies and internal dashboards.</CardContent>
            </Card>
          </div>
        </section>

        {/* YouTube Tools (Internal Linking) */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-2">YouTube Tools</h2>
          <p className="text-center text-gray-600 mb-8">Explore more free tools to streamline your YouTube workflow</p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel ID Finder</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Quickly find the unique ID for any YouTube channel.
                <div className="mt-4">
                  <Link href="/tools/youtube/channel-id-finder">
                    <Button>Try Now →</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shorts Downloader</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Download YouTube Shorts in one click.
                <div className="mt-4">
                  <Link href="/tools/youtube/shorts-downloader">
                    <Button>Try Now →</Button>
                  </Link>
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
                  <Link href="/tools/youtube-tag-extractor">
                    <Button>Try Now →</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}


