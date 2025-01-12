import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Image from 'next/image'
import rubberduckPath from '../public/img/rubberduck.png'
import donaldPath from '../public/img/donald.png'
import landingDuck from '../public/img/landing.png'

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-[#342F2F]">
        <div className="text-white">
        <div className="container mx-auto px-4 py-8 flex flex-col items-center text-center">
        <h1 className="text-4xl items-center mb-10">
          Revolutionize Your <span className="border-2 border-yellow-400 text-yellow-400 pr-4 pl-4 pt-2 pb-2 rounded-full">Studying</span> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600"> AI-powered</span> Voice Chat
        </h1>
            <div className="pb-4 w-full">
            <Image
              src={landingDuck}
              alt="Talktuahduck Demo"
              layout="responsive"
              width={100}
              height={50}
              className="w-full h-auto"
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

