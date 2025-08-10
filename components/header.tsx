import { Youtube, Search, FileText, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Youtube className="h-6 w-6 text-red-600 mr-2" />
            <h1 className="text-2xl font-bold">
              <span>YT</span>
              <span className="text-red-600">Monetizer</span>
            </h1>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-2">
          <Link href="/" passHref>
            <Button variant="ghost" size="sm" className="text-slate-700 flex items-center gap-1">
              <Search className="h-4 w-4" />
              <span>Monetization Checker</span>
            </Button>
          </Link>
          <Link href="/blogs" passHref>
            <Button variant="ghost" size="sm" className="text-slate-700 flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Blog</span>
            </Button>
          </Link>
          <Link href="/sitemap" passHref>
            <Button variant="ghost" size="sm" className="text-slate-700 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Sitemap</span>
            </Button>
          </Link>
          <Link href="/tools/youtube/channel-id-finder" passHref>
            <Button variant="ghost" size="sm" className="text-slate-700 flex items-center gap-1">
              <Search className="h-4 w-4" />
              <span>Channel ID Finder</span>
            </Button>
          </Link>
        </nav>
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
            <span className="mr-1">🇺🇸</span> English
          </Button>
        </div>
      </div>
    </header>
  )
}
