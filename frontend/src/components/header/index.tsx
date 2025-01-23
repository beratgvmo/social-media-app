import {
    TbBell,
    TbChessFilled,
    TbMessage,
    TbSearch,
    TbSearchOff,
    TbUser,
} from "react-icons/tb";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { GoPeople } from "react-icons/go";
import { HiOutlineHome } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import axios from "@/utils/axiosInstance";
import Notifications from "@/components/header/notifications";
import useSearchStore from "@/store/useSearchStore";

interface User {
    name: string;
    profileImage: string | null;
    slug: string;
    id: number;
    bio: string;
}

interface Notification {
    id: number;
    type: "like" | "comment" | "follow";
    isRead: boolean;
    createdAt: string;
    fromUser: User;
}

interface FollowerRequest {
    id: number;
    isRead: boolean;
}

interface HeaderProps {
    setInputFocus: (focused: boolean) => void;
    isInputFocused: boolean;
}

const Header: React.FC<HeaderProps> = ({ setInputFocus, isInputFocused }) => {
    const { user } = useAuthStore();
    const location = useLocation();
    const [isBubble, setIsBubble] = useState(false);
    const bubbleRef = useRef<HTMLDivElement | null>(null);
    const [notificationCount, setNotificationCount] = useState<number>(0);
    const [followerCount, setFollowerCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const inputRef = useRef(null);
    const { recentSearches, addSearch } = useSearchStore();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setInputFocus(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [inputRef]);

    const fetchFollowerRequests = async () => {
        try {
            const response = await axios.get<FollowerRequest[]>(
                "follower/pending-requests"
            );
            const unreadCount = response.data.filter(
                (followerRequest) => !followerRequest.isRead
            ).length;
            setFollowerCount(unreadCount);
        } catch (error) {
            console.error("Takipçi istekleri alınırken hata oluştu", error);
        }
    };

    useEffect(() => {
        if (location.pathname === "/mynetwork") {
            const delayFetch = setTimeout(() => {
                fetchFollowerRequests();
            }, 100);

            return () => clearTimeout(delayFetch);
        }
    }, [location.pathname]);

    useEffect(() => {
        fetchFollowerRequests();
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get<Notification[]>(
                    `/notification/${user?.slug}`
                );
                const unreadCount = response.data.filter(
                    (notification) => !notification.isRead
                ).length;
                setNotifications(response.data);
                setNotificationCount(unreadCount);
            } catch (error) {
                console.error("Bildirimler alınırken hata oluştu", error);
            }
        };
        fetchNotifications();
    }, [isBubble]);

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

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<User[]>([]);

    useEffect(() => {
        if (query.trim()) {
            fetchUsers();
        } else {
            setResults([]);
        }
    }, [query]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("/user/friend-search", {
                params: { query },
            });
            setResults(res.data);
        } catch (err) {
            console.error("Kullanıcı arama hatası:", err);
        }
    };

    return (
        user && (
            <header className="h-16 p-1 top-0 z-50 sticky flex items-center bg-white border-b border-gray-300">
                <div className="w-[1100px] mx-auto flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <Link to="/">
                            <TbChessFilled
                                size={40}
                                className="text-blue-600"
                            />
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="w-[420px] relative" ref={inputRef}>
                                <input
                                    type="text"
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md p-2 outline-none transition-all duration-300 ${
                                        isInputFocused
                                            ? "ring-1 ring-blue-500 border-blue-500 w-full"
                                            : "focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-[70%]"
                                    }`}
                                    placeholder="Arama yap"
                                    required
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => setInputFocus(true)}
                                />
                                {isInputFocused && (
                                    <div className="absolute bg-white shadow-lg z-20 rounded-md border mt-0.5 w-full">
                                        <div className="flex gap-3">
                                            {recentSearches &&
                                                recentSearches.map((search) => (
                                                    <div>{search}</div>
                                                ))}
                                        </div>
                                        {results.length > 0 ? (
                                            <>
                                                {results.map((user) => (
                                                    <Link
                                                        to={`/profile/${user.slug}`}
                                                        key={user.id}
                                                        onClick={() => {
                                                            addSearch(
                                                                user.name
                                                            );
                                                        }}
                                                        className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
                                                    >
                                                        <div className="w-11 h-11 mr-2">
                                                            {user?.profileImage ? (
                                                                <img
                                                                    src={
                                                                        user.profileImage
                                                                    }
                                                                    alt="Profil Resmi"
                                                                    className="w-full h-full rounded-full border border-gray-300"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full rounded-full border border-gray-300 flex bg-gray-200 items-center justify-center">
                                                                    <TbUser className="w-[60%] h-[60%] text-gray-700" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {user.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {user.bio}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </>
                                        ) : query.length > 0 ? (
                                            <div className="p-3 flex items-center gap-1.5">
                                                <TbSearchOff className="w-4 h-4 text-gray-500" />
                                                <p className="text-gray-500 text-sm">
                                                    Sonuç bulunamadı.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="p-3 flex items-center gap-1.5">
                                                <TbSearch className="w-4 h-4 text-gray-500" />
                                                <p className="text-gray-500 text-sm">
                                                    Arama yapmak için bir şeyler
                                                    yazın.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
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
                                className="hover:bg-gray-100 transition relative p-2 rounded-full"
                            >
                                <TbBell size={24} className="text-blue-500" />
                                {notificationCount > 0 && (
                                    <span className="absolute top-0.5 right-0.5 flex items-center justify-center text-xs rounded-full h-4 w-4 bg-red-500 text-gray-100 font-medium">
                                        {notificationCount < 9
                                            ? notificationCount
                                            : "+9"}
                                    </span>
                                )}
                            </button>
                            {isBubble && (
                                <Notifications notifications={notifications} />
                            )}
                        </div>
                        <div className="hover:bg-gray-100 transition p-2 rounded-full">
                            <Link to="/chat">
                                <TbMessage
                                    size={24}
                                    className="text-blue-500"
                                />
                            </Link>
                        </div>
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
        )
    );
};

export default Header;
