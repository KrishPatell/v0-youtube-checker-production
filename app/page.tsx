import MonetizationForm from "@/components/monetization-form"
import { CheckCircle } from 'lucide-react' // Removed Clock as it's not used in this file

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header is now in app/layout.tsx */}

      <main className="container mx-auto px-4 py-6">
        <MonetizationForm />
      </main>

      {/* SEO Content Section */}
      <div className="container mx-auto px-4 py-12 bg-white border-t">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">What is the YouTube Monetization Checker?</h2>
          <p className="mb-6 text-slate-600">
            The YouTube Monetization Checker is a handy tool to check if a YouTube channel or video is monetized. It
            also provides insight into the monetary performance of the channel or video by providing different estimates
            of the potential earnings from a channel and video.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">
            The monetization checker shows the following statistics and information about channels or videos:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="bg-red-500 text-white p-4 flex items-center gap-3">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 3H3c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h6l-2 3v1h8v-1l-2-3h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H3V5h18v11z"/>
      </svg>
      <h4 className="font-bold text-lg">YouTube Channel Monetization Checker</h4>
    </div>
    <div className="p-6">
      <ul className="space-y-3">
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Channel monetization status</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Channel Authenticity Status</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Channel Ad Status</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Channel revenue and earnings calculation</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Channel category check</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Video ad check</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>YouTube shadowban check</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Channel Location details</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Community strike information</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Region restriction checker</span>
        </li>
      </ul>
    </div>
  </div>

  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="bg-blue-500 text-white p-4 flex items-center gap-3">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
      </svg>
      <h4 className="font-bold text-lg">YouTube Video Monetization Checker</h4>
    </div>
    <div className="p-6">
      <ul className="space-y-3">
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Monetization Status of the Video</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Video Authenticity Status</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Advertising Status of the Video</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Total number and types of ads</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Ad breaks analysis</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Channel Creation date</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Tags/Keywords analysis</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Channel statistics</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Video upload details</span>
        </li>
        <li className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>Performance metrics</span>
        </li>
      </ul>
    </div>
  </div>
</div>

          <h3 className="text-xl font-bold mt-8 mb-4">How to check if a YouTube channel is monetized?</h3>
          <div className="mb-6">
            <h4 className="font-bold mb-2">Method 1:</h4>
            <p className="text-slate-600 mb-4">
              To find out if any YouTube channel is monetized, simply paste the YouTube Channel URL into the box on our
              monetization checker form above.
            </p>

            <h4 className="font-bold mb-2">Method 2:</h4>
            <ul className="space-y-2 text-slate-600 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>If you see a join button on the channel</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>If there are ads in many videos of the channel</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>
                  If you see a collaboration link with a Youtube MCN or Cms company on the channel's about page
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>If the channel and video pass the authenticity test</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>If the number of subscribers is more than 1000 and Total watch time is more than 4000 hours</span>
              </li>
            </ul>
            <p className="text-slate-600 font-medium">It is clear that the channel is making money.</p>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4">
            What are the requirements to Enable Monetization on a YouTube Channel?
          </h3>
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 mb-8">
            <p className="mb-4 text-slate-700">YouTube has changed its 'monetization' requirements:</p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>500+ subscribers (reduced from the previous 1,000 requirement)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>3,000+ watch hours in the last 12 months OR 3 million Shorts views in the last 90 days</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>3+ public uploads in the last 90 days</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>An active account that follows YouTube's Community Guidelines</span>
              </li>
            </ul>
            <p className="mt-4 text-slate-700">
              Content creators who meet these updated requirements can apply for the YouTube Partner Program and gain
              access to monetization features.
            </p>
          </div>
        </div>
      </div>

      {/* Footer is now in app/layout.tsx */}
    </div>
  )
}
