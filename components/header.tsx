"use client"

import { Youtube, Search, FileText, Menu, X, Download, Shield as ShieldIcon, Tags as TagsIcon, ChevronDown, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const tools = [
    { href: "/", icon: Search, label: "Monetization Checker" },
    { href: "/tools/youtube/channel-id-finder", icon: Search, label: "Channel ID Finder" },
    { href: "/tools/youtube-video-analyzer", icon: BarChart3, label: "Video Analyzer" },
    // { href: "/tools/youtube/shorts-downloader", icon: Download, label: "Shorts Downloader" },
    { href: "/tools/youtube/copyright-checker", icon: ShieldIcon, label: "Copyright Checker" },
    { href: "/tools/youtube-tag-extractor", icon: TagsIcon, label: "Tag Extractor" },
  ]

  return (
    <header className="border-b bg-white shadow-sm relative z-50">
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
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 relative">
          <Link href="/" passHref>
            <Button variant="ghost" size="sm" className="text-slate-700">Home</Button>
          </Link>

          {/* Tools Dropdown */}
          <div className="group relative">
            <Button variant="ghost" size="sm" className="text-slate-700 flex items-center gap-1">
              YouTube Tools <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 hover:visible hover:opacity-100 transition-opacity duration-150 absolute left-0 mt-1 w-72 bg-white border rounded-lg shadow-lg p-2 z-50">
              {tools.map((t) => (
                <Link key={t.href} href={t.href} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-50">
                  <t.icon className="h-4 w-4 text-slate-600" />
                  <span className="text-sm text-slate-800">{t.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <Link href="/blogs" passHref>
            <Button variant="ghost" size="sm" className="text-slate-700">Blog</Button>
          </Link>
          <Link href="/blogs" passHref>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent hidden sm:flex">
            <span className="mr-1">🇺🇸</span> English
          </Button>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMenu}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMenu}
          />
          
          {/* Slide-out Menu */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMenu}
                className="p-2"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="p-4">
              <div className="space-y-2">
                <Link href="/" onClick={closeMenu} className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">Home</Link>
                <div className="border rounded-lg">
                  <div className="px-4 py-2 text-xs uppercase text-slate-500">YouTube Tools</div>
                  {tools.map((t) => (
                    <Link key={t.href} href={t.href} onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50">
                      <t.icon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">{t.label}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/blogs" onClick={closeMenu} className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">Blog</Link>
                <Link href="/" onClick={closeMenu} className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">Monetization Checker</Link>
              </div>
              
              {/* Language Selector in Mobile Menu */}
              <div className="mt-6 pt-6 border-t">
                <div className="px-4 py-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="mr-1">🇺🇸</span>
                    <span className="font-medium">English</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
