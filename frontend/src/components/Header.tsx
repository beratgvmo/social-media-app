import { TbBell, TbChessFilled, TbMessage, TbUser } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { GoPeople } from "react-icons/go";
import { HiOutlineHome } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import axios from "../utils/axiosInstance";

const Header: React.FC = () => {
    const { user } = useAuthStore();
    const [requests, setRequests] = useState<number>(0);
    const [isBubble, setIsBubble] = useState(false);
    const bubbleRef = useRef<HTMLDivElement | null>(null);

    // Fetch follower requests
    useEffect(() => {
        const fetchFollowerRequests = async () => {
            try {
                const response = await axios.get("follower/pending-requests");
                setRequests(response.data.length);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFollowerRequests();
    }, []);

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
                        <div className="w-[320px]">
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block focus:w-full w-[70%] p-2 outline-none transition-all"
                                placeholder="Arama yap"
                                required
                            />
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
                                `bg-gray-100 text-gray-600 hover:bg-blue-200 hover:text-blue-600 rounded-full w-10 h-10 p-2 transition-colors ${
                                    isActive ? "bg-blue-200 text-blue-600" : ""
                                }`
                            }
                        >
                            <div className="flex items-center justify-center relative">
                                <GoPeople className="w-full h-full" />
                                {requests > 0 && (
                                    <span className="absolute -top-2 -right-3 flex items-center justify-center text-xs rounded-full h-4 w-4 bg-red-500">
                                        <p className="text-gray-100 font-medium">
                                            {requests < 9 ? requests : "+9"}
                                        </p>
                                    </span>
                                )}
                            </div>
                        </NavLink>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    {user ? (
                        <>
                            <div className="relative" ref={bubbleRef}>
                                <button
                                    onClick={() => setIsBubble(!isBubble)}
                                    className="hover:bg-gray-100 transition relative p-2 rounded-full"
                                >
                                    <TbBell
                                        size={24}
                                        className="text-blue-500"
                                    />
                                </button>
                                {isBubble && (
                                    <div className="absolute right-0 top-10 bg-white py-1 w-80 h-96 rounded-lg border shadow"></div>
                                )}
                            </div>
                            <div className="hover:bg-gray-100 transition p-2 rounded-full">
                                <TbMessage
                                    size={24}
                                    className="text-blue-500"
                                />
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
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login">Giriş Yap</Link>
                            <Link to="/register">Kayıt Ol</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
