import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Talktuahduck
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="#features" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                How It Works
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

