import { TbBell, TbChessFilled, TbMessage, TbUser } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { GoPeople } from "react-icons/go";
import { HiOutlineHome } from "react-icons/hi";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
    const { user } = useAuthStore();
    return (
        <header className="h-16 p-1 top-0 z-50 sticky flex items-center bg-white border-b border-gray-300">
            <div className="w-[1100px] mx-auto flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <TbChessFilled size={40} className="text-blue-600" />
                    <div className="flex items-center gap-4">
                        <div className="w-[320px]">
                            <input
                                type="text"
                                id="first_name"
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
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? "bg-blue-200 text-blue-600 rounded-full w-10 h-10 p-2"
                                    : "bg-gray-100 text-gray-600 hover:bg-blue-200 hover:text-blue-600 rounded-full w-10 h-10 p-2 transition-colors"
                            }
                        >
                            <div className="flex items-center justify-center">
                                <GoPeople className="w-full h-full" />
                            </div>
                        </NavLink>
                    </div>
                </div>
                <div className="">
                    {user ? (
                        <div className="flex gap-2 items-center justify-center">
                            <div className="hover:bg-gray-100 transition p-2 rounded-full">
                                <TbBell size={24} className="text-blue-500" />
                            </div>
                            <div className="hover:bg-gray-100 transition p-2 rounded-full">
                                <TbMessage
                                    size={24}
                                    className="text-blue-500"
                                />
                            </div>
                            <Link to="/profile">
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profil Resmi"
                                        className="w-10 h-10 ml-1 rounded-full border bg-white"
                                    />
                                ) : (
                                    <TbUser className="w-10 h-10 p-2 flex items-center border text-blue-500" />
                                )}
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login">Giris Yap</Link>
                            <Link to="/register">Kayıt Ol</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
