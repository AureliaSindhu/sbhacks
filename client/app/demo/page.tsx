'use client'

import Transcript from '../../components/Transcript'
import Sources from '../../components/Sources'

export default function Home() {

    return (
        <div className = "p-4 grid grid-cols-2 h-screen bg-[#342F2F] space-x-4">
                <Transcript />
                <Sources />
        </div>
    )
}

