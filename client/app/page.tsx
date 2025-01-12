import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Image from 'next/image'
import rubberduckPath from '../public/img/rubberduck.png'
import donaldPath from '../public/img/donald.png'

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-[#342F2F]">
        <div className="text-white">
        <div className="container mx-auto px-4 py-8 flex flex-col items-center text-center">
        <h1 className="text-4xl items-center mb-4">
            Revolutionize Your Study Experience with 
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 ml-2">Talktuahduck</span>
        </h1>
          {/* <p className="text-xl mb-8 max-w-2xl">
        Transform unstructured notes into interactive learning sessions. Explain concepts out loud, boost comprehension, and master your studies with AI-powered assistance.
          </p> */}
          <div className="pb-4">
        <Image
          src={rubberduckPath}
          alt="Talktuahduck Demo"
          width={350}
          height={350}
          // className="p-[-10]"
        />
          </div>
          <div className="flex space-x-2">
            <Button size="lg" className="bg-gray-600 p-4 ml-4 mr-4 hover:bg-yellow-500 hover:text-black">
              Start Learning
            </Button>
            <Button size="lg" className="bg-gray-600 p-4 ml-4 mr-4 hover:bg-yellow-500 hover:text-black">
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

