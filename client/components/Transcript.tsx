import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic } from 'lucide-react'

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

export default function Transcript() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const transcriptEndRef = useRef<HTMLDivElement | null>(null);

    const handleSend = () => {
        if (input.trim()) {
        setMessages([...messages, { id: messages.length + 1, text: input, sender: 'user' }])
        setInput('')
        }
    }

    useEffect(() => {
        const connectToRetellAI = () => {
            const socket = new WebSocket("ws://localhost:8000/ws?client_id=1234");

            socket.onmessage = (event) => {
                const aiMessage = JSON.parse(event.data);
                setMessages((prev) => [...prev, { id: prev.length + 1, text: aiMessage.text, sender: 'ai' }]);
            };

            socket.onopen = () => {
                console.log("Connected to Retell AI.");
            };

            socket.onclose = () => {
                console.log("Disconnected from Retell AI.");
            };

            return () => {
                socket.close();
            };
        };

        connectToRetellAI();
    }, []);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-6">Chat Transcript</h2>
            <div className="flex-grow overflow-auto mb-4">
                {messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-[#342F2F] text-yellow-400' : 'bg-gray-200 text-[#342F2F]'}`}>
                    {message.text}
                    </div>
                </div>
                ))}
            </div>

            <div className="flex justify-center items-center bg-yellow-400 rounded-full p-4 w-auto hover:bg-[#342F2F] hover:text-yellow-400">
                <Mic />
            </div>
        </div>
    );
}

