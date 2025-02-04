import { useEffect, useRef, useState } from "react";
import axios from "@/utils/axiosInstance";
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
    const { user } = useAuthStore();

    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputClick = () => {
        inputRef.current?.focus();
    };

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`chat/userRooms/${user.id}`);
            setChatRooms(response.data);
        } catch (error) {
            console.error("Mesajları alırken hata oluştu:", error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [user.id]);

    return (
        <div className="flex w-full h-full">
            <div className="w-2/6 min-w-[300px] h-full bg-white">
                <ChatSidebar
                    user={user}
                    chatRooms={chatRooms}
                    thisRoom={thisRoom}
                    setThisRoom={setThisRoom}
                    handleInputClick={handleInputClick}
                    inputRef={inputRef}
                    fetchRooms={fetchRooms}
                />
            </div>

            <div className="flex flex-1 flex-col h-full w-4/6 bg-white">
                {!thisRoom && <ChatWelcome />}
                {thisRoom && (
                    <div className="flex flex-col h-full">
                        <div>
                            {chatRooms.map(
                                (room) =>
                                    room.id === thisRoom && (
                                        <ChatHeader
                                            key={room.id}
                                            room={room}
                                            user={user}
                                        />
                                    )
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto mr-0.5">
                            <ChatMessage
                                chatRoomId={thisRoom}
                                userId={user.id}
                            />
                        </div>

                        <div>
                            <MessageInput
                                chatRoomId={thisRoom}
                                userId={user.id}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
