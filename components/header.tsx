"use client"

import { Youtube, Search, FileText, Clock, Tag, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const navigationItems = [
    {
      href: "/",
      icon: Search,
      label: "Monetization Checker"
    },
    {
      href: "/blogs",
      icon: FileText,
      label: "Blog"
    },
    {
      href: "/sitemap",
      icon: Clock,
      label: "Sitemap"
    },
    {
      href: "/tools/youtube/channel-id-finder",
      icon: Search,
      label: "Channel ID Finder"
    },
    {
      href: "/tools/youtube-tag-extractor",
      icon: Tag,
      label: "Tag Extractor"
    }
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
        <nav className="hidden md:flex items-center space-x-2">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <Button variant="ghost" size="sm" className="text-slate-700 flex items-center gap-1">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
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
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <item.icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
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
