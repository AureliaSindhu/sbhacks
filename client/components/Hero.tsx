import { Button } from "@/components/ui/button"
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Revolutionize Your Study Experience with Talktuahduck
          </h1>
          <p className="text-xl mb-8">
            Transform unstructured notes into interactive learning sessions. Explain concepts out loud, boost comprehension, and master your studies with AI-powered assistance.
          </p>
          <div className="flex space-x-4">
            <Button size="lg" variant="secondary">
              Start Learning
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Talktuahduck Demo"
            width={600}
            height={400}
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  )
}

