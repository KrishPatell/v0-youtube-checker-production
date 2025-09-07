import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ToolsGrid() {
  return (
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

        {false && (
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
        )}

        <Card>
          <CardHeader>
            <CardTitle>Copyright Checker</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Check license, visibility and region restrictions.
            <div className="mt-4">
              <Link href="/tools/youtube/copyright-checker">
                <Button>Try Now →</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}


