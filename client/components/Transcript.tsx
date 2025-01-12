import { useState, useEffect, useRef } from "react";
import { Mic, User, Bot } from "lucide-react";

type Message = {
    id: number;
    text: string;
    sender: "user" | "ai";
};

export default function Transcript() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const transcriptEndRef = useRef<HTMLDivElement | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const connectToRetellAI = () => {
            const socket = new WebSocket("ws://localhost:8000/ws?client_id=1234");

            socket.onopen = () => {
                console.log("Connected to Retell AI.");
                setSocket(socket);

                socket.send(
                    JSON.stringify({
                        event: "start_conversation",
                        content: "Hello! Let's begin our chat.",
                        timestamp: new Date().toISOString(),
                    })
                );
            };

            socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                if (response.event === "ai_message") {
                    setMessages((prev) => [
                        ...prev,
                        { id: prev.length + 1, text: response.content, sender: "ai" },
                    ]);
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            socket.onclose = () => {
                console.log("Disconnected from Retell AI. Reconnecting...");
                setTimeout(connectToRetellAI, 3000);
            };
        };

        connectToRetellAI();
    }, []);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleMicToggle = () => {
        setIsListening((prev) => !prev);
        console.log(isListening ? "Listening stopped" : "Listening started");
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-6">Live Transcript</h2>
            <div className="flex-grow overflow-auto mb-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`mb-4 flex items-start ${
                            message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                        {message.sender === "ai" && (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                                <Bot size={16} />
                            </div>
                        )}
                        <div
                            className={`inline-block p-3 rounded-lg ${
                                message.sender === "user"
                                    ? "bg-blue-500 text-white text-right"
                                    : "bg-gray-200 text-gray-800 text-left"
                            }`}
                        >
                            {message.text}
                        </div>
                        {message.sender === "user" && (
                            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white ml-2">
                                <User size={16} />
                            </div>
                        )}
                    </div>
                ))}
                <div ref={transcriptEndRef} />
            </div>
            <div className="flex items-center justify-center">
                <button
                    className={`p-3 rounded-full ${
                        isListening ? "bg-red-500" : "bg-yellow-400"
                    } text-white`}
                    onClick={handleMicToggle}
                >
                    <Mic />
                </button>
            </div>
        </div>
    );
}
