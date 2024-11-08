import { useState, FC, ChangeEvent, useRef, useEffect } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { TbSend2 } from "react-icons/tb";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

interface MessageInputProps {
    chatRoomId: number;
    userId: number;
}

const MessageInput: FC<MessageInputProps> = ({ chatRoomId, userId }) => {
    const [message, setMessage] = useState<string>("");
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prevMessage) => prevMessage + emojiData.emoji);
        setIsEmojiPickerOpen(false);
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        e.target.style.height = "36px";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    useEffect(() => {
        if (!socket) {
            socket = io("http://localhost:3000");
        }

        if (chatRoomId) {
            socket.emit("joinRoom", chatRoomId);
        }

        return () => {
            if (chatRoomId) {
                socket.emit("leaveRoom", chatRoomId);
            }
            socket.off("newMessage");
        };
    }, [chatRoomId]);

    const sendMessage = () => {
        if (message.trim() && chatRoomId !== null) {
            socket.emit("sendMessage", {
                content: message,
                chatRoomId: chatRoomId,
                senderId: userId,
            });

            setMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex w-[75%] items-center px-5 py-1 border-t bg-white">
            <div>
                <button
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                    className="p-2 rounded-lg hover:bg-gray-200"
                >
                    <MdOutlineEmojiEmotions className="text-xl text-gray-600" />
                </button>
                {isEmojiPickerOpen && (
                    <div className="absolute bottom-14">
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            emojiStyle={EmojiStyle.GOOGLE}
                            searchPlaceholder="Arama Yap"
                            height={400}
                        />
                    </div>
                )}
            </div>
            <div className="w-full px-2 py-0.5">
                <textarea
                    ref={inputRef}
                    rows={1}
                    value={message}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Bir mesaj yazın"
                    className="w-full resize-none outline-none h-[36px] max-h-[100px] text-sm text-gray-800 overflow-hidden p-2"
                />
            </div>
            <button
                onClick={sendMessage}
                className="p-2 rounded-lg hover:bg-gray-200"
            >
                <TbSend2 className="text-xl text-gray-600" />
            </button>
        </div>
    );
};

export default MessageInput;
