import Link from "next/link"
import { Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="flex justify-center mb-6">
          <Youtube className="h-16 w-16 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the blog post you're looking for. It may have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/blogs" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700">Browse All Blog Posts</Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
