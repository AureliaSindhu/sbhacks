import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-2">
      <div className="container mx-auto">
        <div className="text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Talktuahduck. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

