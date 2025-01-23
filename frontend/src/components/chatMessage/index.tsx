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

    const formatMessageDate = (date: string) => {
        const messageDate = new Date(date);
        const now = new Date();

        const isSameDay = messageDate.toDateString() === now.toDateString();
        const isYesterday =
            new Date(now.getTime() - 86400000).toDateString() ===
            messageDate.toDateString();
        const isThisWeek =
            now.getTime() - messageDate.getTime() < 7 * 86400000 &&
            now.getDay() >= messageDate.getDay();

        if (isSameDay) return "Bugün";
        if (isYesterday) return "Dün";
        if (isThisWeek)
            return messageDate.toLocaleDateString("tr-TR", {
                weekday: "long",
            });
        return messageDate.toLocaleDateString("tr-TR");
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

        const handleNewMessage = (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };
        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.emit("leaveRoom", chatRoomId);
            socket.off("newMessage", handleNewMessage);
        };
    }, [chatRoomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="h-full w-full px-3 overflow-auto pt-3 scrollbar-custom">
            {messages.map((msg, index) => {
                const showDate =
                    index === 0 ||
                    new Date(messages[index - 1].createdAt).toDateString() !==
                        new Date(msg.createdAt).toDateString();

                return (
                    <div key={msg.id}>
                        {showDate && (
                            <div className="flex justify-center my-2">
                                <span className="text-xs text-gray-700 px-2 py-1 bg-gray-200 rounded-lg">
                                    {formatMessageDate(msg.createdAt)}
                                </span>
                            </div>
                        )}
                        <div
                            className={`flex ${
                                msg.sender.id === userId
                                    ? "justify-end"
                                    : "justify-start"
                            } mb-4`}
                        >
                            <div
                                className={`px-2 pt-1.5 pb-1.5 rounded-lg max-w-[40%] relative ${
                                    msg.sender.id === userId
                                        ? "bg-sky-300"
                                        : "bg-gray-200"
                                }`}
                            >
                                <p className="text-sm pr-10 break-words">
                                    {msg.content}
                                </p>
                                <p className="text-[10px] opacity-60 absolute bottom-1 right-2">
                                    {new Date(msg.createdAt).toLocaleTimeString(
                                        [],
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessage;
