import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Image from 'next/image'
import rubberduckPath from '../public/img/rubberduck.png'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-blue-200">
        <div className="text-black">
        <div className="container mx-auto px-4 py-10 flex flex-col items-center text-center">
          <h1 className="text-4xl max-w-3xl">
            Revolutionize Your Study Experience with <span className="font-black">Talktuahduck</span>
          </h1>
          {/* <p className="text-xl mb-8 max-w-2xl">
            Transform unstructured notes into interactive learning sessions. Explain concepts out loud, boost comprehension, and master your studies with AI-powered assistance.
          </p> */}
          <div className="pb-4">
            <Image
              src={rubberduckPath}
              alt="Talktuahduck Demo"
              width={380}
              height={380}
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
      </main>
      <Footer />
    </div>
  )
}

