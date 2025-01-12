import { useState, useEffect, useRef } from "react";
import { Mic, User, Bot } from "lucide-react";
import { RetellWebClient } from "retell-client-js-sdk";


type Message = {
    id: number;
    text: string;
    sender: "user" | "ai";
};

interface RegisterCallResponse {
    access_token: string;
    call_id: string;
    }

export default function Transcript() {
    const retellWebClient = new RetellWebClient();
    const [isCalling, setIsCalling] = useState(false);
    const [fullTranscript, setFullTranscript] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const callId = useRef("");

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const transcriptEndRef = useRef<HTMLDivElement | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {

        retellWebClient.on("call_started", () => {
            console.log("Call started");
            setIsCalling(true);
            });
        
            retellWebClient.on("agent_start_talking", () => {
            console.log("Agent started talking");
            });
        
            retellWebClient.on("agent_stop_talking", () => {
            console.log("Agent stopped talking");
            });
        
            retellWebClient.on("update", (update) => {
            setFullTranscript((prevTranscript: any) => {
                if (update.transcript.length === 0) {
                return prevTranscript;
                }
        
                const newMessage = update.transcript[update.transcript.length - 1];
                const updatedTranscript = [...prevTranscript];
        
                if (updatedTranscript.length > 0) {
                const lastMessage = updatedTranscript[updatedTranscript.length - 1];
        
                if (lastMessage.role === newMessage.role) {
                    updatedTranscript[updatedTranscript.length - 1] = newMessage;
                } else {
                    updatedTranscript.push(newMessage);
                }
                } else {
                updatedTranscript.push(newMessage);
                }
        
                return updatedTranscript;
            });
            });
        
            retellWebClient.on("metadata", (metadata) => {
            // Handle metadata if needed
            });
        
            retellWebClient.on("call_ended", async (e) => {
            console.log("Call has ended. Logging call id: ");
            setIsCalling(false);
            });
        
            retellWebClient.on("error", (error) => {
            console.error("An error occurred:", error);
            retellWebClient.stopCall();
            setIsLoading(false);
            });
        
        
        
            // Cleanup on unmount
            return () => {
            retellWebClient.off("call_started");
            retellWebClient.off("call_ended");
            retellWebClient.off("agent_start_talking");
            retellWebClient.off("agent_stop_talking");
            retellWebClient.off("audio");
            retellWebClient.off("update");
            retellWebClient.off("metadata");
            retellWebClient.off("error");
            };
        }, []);
        
        
        
        async function startCall() {
            try {
            const response = await fetch("/api/create-web-call", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                agent_id: "agent_c5ae64152c9091e17243c9bdfc", // Default test agent
                }),
            });
        
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
        
            const registerCallResponse: RegisterCallResponse = await response.json();
        
            callId.current = registerCallResponse.call_id;
            console.log("---- FOUND CALL ID ------");
        
            if (registerCallResponse.access_token) {
                await retellWebClient.startCall({
                accessToken: registerCallResponse.access_token,
                });
                setIsLoading(false); // Call has started, loading is done
            }
        
        
            } catch (err) {
            console.error("Error starting call:", err);
            }
        }

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
                    onClick={startCall}
                    disabled={isCalling}
                    className={`p-3 rounded-full ${
                        isListening ? "bg-red-500" : "bg-yellow-400"
                    } text-white`}
                >
                    <Mic />
                    {isCalling ? "Call in Progress..." : "Start Call"}
                </button>
            </div>
        </div>
    );
}
