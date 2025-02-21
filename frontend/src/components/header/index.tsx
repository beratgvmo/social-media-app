import { TbBell, TbChessFilled, TbMessage, TbUser } from "react-icons/tb";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { GoPeople } from "react-icons/go";
import { HiOutlineHome } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import axios from "@/utils/axiosInstance";
import Notifications from "@/components/header/notifications";
import SearchModal from "./searchModal";

import { io, Socket } from "socket.io-client";

let socket: Socket;

interface FollowerRequest {
    id: number;
    isRead: boolean;
}

interface HeaderProps {
    setInputFocus?: (focused: boolean) => void;
    isInputFocused?: boolean;
}

const Header: React.FC<HeaderProps> = ({ setInputFocus, isInputFocused }) => {
    const { user } = useAuthStore();
    const location = useLocation();
    const [isBubble, setIsBubble] = useState(false);
    const bubbleRef = useRef<HTMLDivElement | null>(null);
    const [followerCount, setFollowerCount] = useState<number>(0);
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        if (!socket) {
            socket = io("http://localhost:3000");
        }

        socket.emit("userId", user.id);

        socket.emit("sendNotification", user.id);

        socket.emit("sendFollower", user.id);

        const handleNewFollower = (followerCount: number) => {
            setFollowerCount(followerCount);
            console.log("followerCount:", followerCount);
        };

        socket.on("follower", handleNewFollower);

        const handleNewMessage = (notificationCount: number) => {
            setNotificationCount(notificationCount);
            console.log("notificationCount:", notificationCount);
        };

        socket.on("notification", handleNewMessage);

        return () => {
            socket.off("notification", handleNewMessage);
            socket.off("follower", handleNewFollower);
        };
    }, [user.id, isBubble]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                bubbleRef.current &&
                !bubbleRef.current.contains(event.target as Node)
            ) {
                setIsBubble(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="h-16 p-1 top-0 z-50 sticky flex items-center bg-white border-b border-gray-300">
            <div className="w-[1100px] mx-auto flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <Link to="/">
                        <TbChessFilled size={40} className="text-blue-600" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <SearchModal
                            isInputFocused={isInputFocused}
                            setInputFocus={setInputFocus}
                        />
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `rounded-full w-10 h-10 p-2 flex items-center justify-center transition-colors ${
                                    isActive
                                        ? "bg-blue-200 text-blue-600"
                                        : "bg-gray-100 text-gray-600 hover:bg-blue-200 hover:text-blue-600"
                                }`
                            }
                        >
                            <HiOutlineHome className="w-full h-full" />
                        </NavLink>
                        <NavLink
                            to="/mynetwork"
                            className={({ isActive }) =>
                                `rounded-full w-10 h-10 flex items-center justify-center transition-colors ${
                                    isActive
                                        ? "bg-blue-200 text-blue-600"
                                        : "bg-gray-100 text-gray-600 hover:bg-blue-200 hover:text-blue-600"
                                }`
                            }
                        >
                            <div className="flex items-center justify-center relative">
                                <GoPeople className="w-full h-full text-xl" />
                                {followerCount > 0 && (
                                    <span className="absolute -top-2 -right-3 flex items-center justify-center text-xs rounded-full h-4 w-4 bg-red-500">
                                        <p className="text-gray-100 font-medium">
                                            {followerCount < 9
                                                ? followerCount
                                                : "+9"}
                                        </p>
                                    </span>
                                )}
                            </div>
                        </NavLink>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="relative" ref={bubbleRef}>
                        <button
                            onClick={() => setIsBubble(!isBubble)}
                            className={`hover:bg-gray-100 transition relative p-2 rounded-full ${
                                isBubble && "bg-gray-100"
                            }`}
                        >
                            <TbBell size={24} className="text-blue-500" />
                            {notificationCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 flex items-center justify-center text-xs rounded-full h-5 w-5 bg-red-500 text-gray-100 font-medium">
                                    {notificationCount < 9
                                        ? notificationCount
                                        : "+9"}
                                </span>
                            )}
                        </button>
                        {isBubble && <Notifications />}
                    </div>

                    <NavLink
                        to="/chat"
                        className={({ isActive }) =>
                            `transition p-2 rounded-full ${
                                isActive ? "bg-gray-200" : "hover:bg-gray-200"
                            }`
                        }
                    >
                        <TbMessage size={24} className="text-blue-500" />
                    </NavLink>
                    <Link to={`/profile/${user.slug}`}>
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt="Profil Resmi"
                                className="w-10 h-10 ml-1 rounded-full border bg-white"
                            />
                        ) : (
                            <TbUser className="w-10 h-10 p-2 flex items-center border rounded-full text-blue-500" />
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
