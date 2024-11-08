import { useEffect, useRef, useState } from "react";
import axios from "@/utils/axiosInstance";
import { io, Socket } from "socket.io-client";

let socket: Socket;

interface Message {
    id: number;
    content: string;
    createdAt: string;
    sender: User;
}

interface User {
    id: number;
    name: string;
    profileImage: string;
}

interface ChatComponentProps {
    chatRoomId: number;
    userId: number;
}

const ChatMessage: React.FC<ChatComponentProps> = ({ chatRoomId, userId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!socket) {
            socket = io("http://localhost:3000");
        }

        const fetchMessages = async () => {
            try {
                const response = await axios.get<Message[]>(
                    `chat/messages/${chatRoomId}`
                );
                setMessages(response.data);
            } catch (error) {
                console.error("Mesajları alırken hata oluştu:", error);
            }
        };

        setMessages([]);
        fetchMessages();

        socket.emit("joinRoom", chatRoomId);

        socket.on("newMessage", (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.emit("leaveRoom", chatRoomId);
            socket.off("newMessage");
        };
    }, [chatRoomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="h-full w-[75%] overflow-auto px-5 pt-4 scrollbar-custom">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${
                        msg.sender.id === userId
                            ? "justify-end"
                            : "justify-start"
                    } mb-4`}
                >
                    <div
                        className={`px-2 pt-1.5 pb-1.5 rounded-lg max-w-[40%] relative ${
                            msg.sender.id === userId ? "bg-sky-300" : "bg-white"
                        }`}
                    >
                        <p className="text-sm pr-10 break-words">
                            {msg.content}
                        </p>
                        <p className="text-[10px] opacity-60 absolute bottom-1 right-2">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessage;
