import Link from "next/link"
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white py-12 border-t mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">YT</span>
              </div>
              <span className="text-xl font-bold text-slate-900">YTMonetizer</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              The most reliable YouTube monetization checker and analytics tool. Get detailed insights into any YouTube channel or video.
            </p>
          </div>

          {/* Company Section */}
          <div className="col-span-1">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-slate-600 hover:text-slate-900 text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-slate-900 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-slate-900 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-slate-900 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools Section */}
          <div className="col-span-1">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm">Tools</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-slate-600 hover:text-slate-900 text-sm">
                  Monetization Checker
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube/channel-id-finder" className="text-slate-600 hover:text-slate-900 text-sm">
                  Channel ID Finder
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-tag-extractor" className="text-slate-600 hover:text-slate-900 text-sm">
                  YouTube Tag Extractor
                </Link>
              </li>
              {/* <li>
                <Link href="/tools/youtube/shorts-downloader" className="text-slate-600 hover:text-slate-900 text-sm">
                  Shorts Downloader
                </Link>
              </li> */}
              <li>
                <Link href="/tools/youtube/copyright-checker" className="text-slate-600 hover:text-slate-900 text-sm">
                  Copyright Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="col-span-1">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blogs" className="text-slate-600 hover:text-slate-900 text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-slate-600 hover:text-slate-900 text-sm">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-slate-600 hover:text-slate-900 text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-slate-600 hover:text-slate-900 text-sm">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t pt-8 mt-8">
          <div className="flex items-center justify-center text-sm text-slate-600">
            <span>© 2025 YTMonetizer. All rights reserved. Built with </span>
            <Heart className="h-4 w-4 text-red-500 mx-1 fill-current" />
            <span> for YouTube creators.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
