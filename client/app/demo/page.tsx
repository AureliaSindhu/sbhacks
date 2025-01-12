'use client'

import Transcript from '../../components/Transcript'
import Sources from '../../components/Sources'
import { useState } from 'react'

export default function Home() {
    const [pdfUrl, setPdfUrl] = useState('/sample.pdf')

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
        <Transcript />
        <Sources pdfUrl={pdfUrl} />
        </div>
    )
}

