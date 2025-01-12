import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import LogoIcon from "../public/img/logo.png"

export default function Navbar() {
  return (
    <nav className="bg-[#342F2F] shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image src={LogoIcon} alt="Logo" width={32} height={32} className="mr-2"/>
              <Link href="/" className="text-2xl font-bold text-white">
              Talktuahduck
              </Link>
            </div>
          <div className="md:block bg-[#232020] m-4 rounded-full">
            <div className="ml-10 mr-10 flex items-baseline space-x-4">
              <Link href="#features" className="text-gray-300 hover:text-[#EFE63E] px-3 py-2 rounded-md text-sm font-medium">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-300 hover:text-[#EFE63E] px-3 py-2 rounded-md text-sm font-medium">
                How It Works
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-[#EFE63E] px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
            </div>
          </div>
            <div className="hidden md:block">
              <Link href="/demo">
                <Button className="bg-[#EFE63E] text-black hover:bg-[#232020] hover:text-white">Get Started</Button>
              </Link>
            </div>
        </div>
      </div>
    </nav>
  )
}

