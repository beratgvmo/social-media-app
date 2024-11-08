import { useEffect, useRef, useState } from "react";
import axios from "../utils/axiosInstance";
import { useAuthStore } from "@/store/useAuthStore";
import ChatMessage from "@/components/chatMessage";
import ChatSidebar from "@/components/chatSidebar";
import ChatWelcome from "@/components/chatWelcome";
import ChatHeader from "@/components/chatHeader";
import MessageInput from "@/components/messageInput";

interface RoomChat {
    id: number;
    user1: User;
    user2: User;
}

interface User {
    id: number;
    name: string;
    profileImage: string;
    slug: string;
}

const Chat: React.FC = () => {
    const [chatRooms, setChatRooms] = useState<RoomChat[]>([]);
    const [thisRoom, setThisRoom] = useState<number | null>(null);
    const [messageInput, setMessageInput] = useState<string>("");
    const { user } = useAuthStore();

    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputClick = () => {
        inputRef.current?.focus();
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`chat/userRooms/${user.id}`);
                setChatRooms(response.data);
            } catch (error) {
                console.error("Mesajları alırken hata oluştu:", error);
            }
        };

        fetchRooms();
    }, [user.id]);

    return (
        <div className="w-full h-full flex">
            <ChatSidebar
                user={user}
                chatRooms={chatRooms}
                thisRoom={thisRoom}
                setThisRoom={setThisRoom}
                handleInputClick={handleInputClick}
                inputRef={inputRef}
            />
            <div className="w-full h-full">
                {!thisRoom && <ChatWelcome />}
                {thisRoom && (
                    <div className="h-[100%] relative flex flex-col justify-end">
                        <div className="absolute top-0 w-full z-10">
                            {chatRooms.map(
                                (room) =>
                                    room.id == thisRoom && (
                                        <ChatHeader room={room} user={user} />
                                    )
                            )}
                        </div>
                        <div className="bg-slate-200 w-[100%] h-[83%]">
                            <ChatMessage
                                chatRoomId={thisRoom}
                                userId={user.id}
                            />
                        </div>
                        <MessageInput chatRoomId={thisRoom} userId={user.id} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
