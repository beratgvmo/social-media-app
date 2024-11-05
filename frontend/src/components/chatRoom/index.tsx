import { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import { io, Socket } from "socket.io-client";

let socket: Socket;

interface Message {
    id: number;
    content: string;
    senderId: number;
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

const ChatComponent: React.FC<ChatComponentProps> = ({
    chatRoomId,
    userId,
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState<string>("");

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
                console.log(response.data);
            } catch (error) {
                console.error("Mesajları alırken hata oluştu:", error);
            }
        };
        fetchMessages();

        socket.emit("joinRoom", chatRoomId);

        socket.on("newMessage", (message: Message) => {
            console.log("Yeni mesaj alındı:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.emit("leaveRoom", chatRoomId);
            socket.off("newMessage");
        };
    }, [chatRoomId]);

    const sendMessage = () => {
        if (messageInput.trim()) {
            socket.emit("sendMessage", {
                content: messageInput,
                chatRoomId,
                senderId: userId,
            });
            setMessageInput("");
        }
    };

    return (
        <div className="flex flex-col h-screen p-4 bg-gray-100">
            <div className="flex-grow overflow-y-auto p-4 bg-white rounded-lg shadow-md">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`mb-2 p-2 rounded ${
                            msg.senderId === userId
                                ? "bg-blue-500 text-white text-right"
                                : "bg-gray-200 text-left"
                        }`}
                    >
                        <span className="block">{msg.content}</span>
                        <span className="text-xs text-gray-500">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex mt-4">
                <input
                    type="text"
                    className="flex-grow p-2 border border-gray-300 rounded-l-lg"
                    placeholder="Mesajınızı yazın..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                    onClick={sendMessage}
                >
                    Gönder
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
