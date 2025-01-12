import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

export default function Transcript() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I help you today?", sender: 'ai' },
        { id: 2, text: "I have a question about quantum physics.", sender: 'user' },
        { id: 3, text: "Great! What would you like to know about quantum physics?", sender: 'ai' },
    ])
    const [input, setInput] = useState('')

    const handleSend = () => {
        if (input.trim()) {
        setMessages([...messages, { id: messages.length + 1, text: input, sender: 'user' }])
        setInput('')
        // Here you would typically call an API to get the AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { id: prev.length + 1, text: "I'm processing your question about quantum physics. Please give me a moment.", sender: 'ai' }])
        }, 1000)
        }
    }

    return (
        <div className="flex flex-col h-full bg-gray-100 p-4">
        <div className="flex-grow overflow-auto mb-4">
            {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
                {message.text}
                </div>
            </div>
            ))}
        </div>
        <div className="flex gap-2">
            <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}>Send</Button>
        </div>
        </div>
    )
}

