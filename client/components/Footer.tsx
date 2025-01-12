import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#342F2F] text-white pb-4">
      <div className="container mx-auto">
        <div className="text-center">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} Talktuahduck | Made with lots of 💤 at SBHacks2025.</p>
        </div>
      </div>
    </footer>
  )
}

