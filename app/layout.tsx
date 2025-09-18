import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/react"
import { Header } from "@/components/header" // Import the Header component
import { Footer } from "@/components/footer" // Import the Footer component

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "YTMonetizer - YouTube Monetization Checker & Revenue Calculator",
  description:
    "Check if a YouTube channel or video is monetized and analyze potential revenue. Get detailed insights into monetization requirements and performance metrics.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics Tracking Code */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-FKVHZXDZ5N" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FKVHZXDZ5N');
          `}
        </Script>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#e53e3e" />
        <meta name="msapplication-TileColor" content="#e53e3e" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Header /> {/* Add the Header component here */}
          {children}
        </ThemeProvider>
        {/* Hidden AdSense Script */}
        <div style={{ display: "none" }}>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8182382315648187"
            crossOrigin="anonymous"
          ></script>
        </div>
        <Footer /> {/* Add the Footer component here */}
        <Analytics />
      </body>
    </html>
  )
}
