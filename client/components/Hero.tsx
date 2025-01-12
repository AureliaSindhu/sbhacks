import { Button } from "@/components/ui/button"
import Image from 'next/image'
import rubberduckPath from "@/public/img/rubberduck.png";

export default function Hero() {
  return (
    <div className="bg-gradient-to-r bg-blue-800 text-white">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-3xl">
          Revolutionize Your Study Experience with Talktuahduck
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          Transform unstructured notes into interactive learning sessions. Explain concepts out loud, boost comprehension, and master your studies with AI-powered assistance.
        </p>
        <div className="mb-10">
          <Image
            src={rubberduckPath}
            alt="Talktuahduck Demo"
            width={400}
            height={400}
            className="p-[-10]"
          />
        </div>
        <div className="flex space-x-4">
          <Button size="lg" variant="secondary">
            Start Learning
          </Button>
          <Button size="lg" variant="secondary">
            Watch Demo
          </Button>
        </div>
      </div>
    </div>
  )
}
