'use client'

import Transcript from '../../components/Transcript'
// import Sources from '../../components/Sources'
import { useState } from 'react'

export default function Home() {
    const [pdfUrl, setPdfUrl] = useState('/sample.pdf')

    return (
        <div className = "p-4 grid grid-cols-2 h-screen bg-[#0A3D64]">
                <Transcript />
                {/* <Sources pdfUrl={pdfUrl} /> */}
        </div>
    )
}

