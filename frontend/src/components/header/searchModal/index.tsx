import { useState, useRef, useEffect, FC } from "react";
import { Link } from "react-router-dom";
import { TbUser, TbSearchOff, TbSearch } from "react-icons/tb";
import useSearchStore from "@/store/useSearchStore";
import axios from "@/utils/axiosInstance";

interface User {
    name: string;
    profileImage: string | null;
    slug: string;
    id: number;
    bio: string;
}

interface SearchProps {
    setInputFocus: (focused: boolean) => void;
    isInputFocused: boolean;
}

const SearchModal: FC<SearchProps> = ({ setInputFocus, isInputFocused }) => {
    const { recentSearches, addSearch, clearSearches } = useSearchStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const [resultSave, setResultSave] = useState<User[]>([]);
    const [results, setResults] = useState<User[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setInputFocus(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setInputFocus]);

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

    useEffect(() => {
        if (recentSearches.length > 0 && isInputFocused) {
            const fetchUsersInOrder = async () => {
                try {
                    const users = await Promise.all(
                        recentSearches.map(async (search) => {
                            try {
                                const res = await axios.get(
                                    `/user/profile/${search}`
                                );
                                return res.data;
                            } catch (err) {
                                if (err.response?.status === 404) {
                                    const updatedSearches =
                                        recentSearches.filter(
                                            (s) => s !== search
                                        );
                                    localStorage.setItem(
                                        "recent-searches",
                                        JSON.stringify(updatedSearches)
                                    );
                                    return null;
                                }
                                throw err;
                            }
                        })
                    );

                    const validUsers = users.filter((user) => user !== null);
                    setResultSave(validUsers);
                } catch (err) {
                    console.error(
                        "Kullanıcı bilgileri alınırken hata oluştu:",
                        err
                    );
                }
            };

            fetchUsersInOrder();
        } else {
            setResultSave([]);
        }
    }, [recentSearches, isInputFocused]);

    return (
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
                        {resultSave.length > 0 && (
                            <div className="flex flex-col border-b pb-2 mt-2 gap-1 px-3">
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium">
                                        En Yeni
                                    </p>
                                    <button
                                        onClick={clearSearches}
                                        className="text-sm font-medium"
                                    >
                                        Temizle
                                    </button>
                                </div>
                                <div className="flex px-2">
                                    {resultSave.map((searchUser, index) => (
                                        <div
                                            key={index}
                                            className="flex cursor-pointer w-20 px-1 pt-2 mx-2 hover:bg-gray-200 rounded transition flex-col items-center justify-center"
                                        >
                                            <div className="w-11 h-11">
                                                {searchUser?.profileImage ? (
                                                    <img
                                                        src={
                                                            searchUser.profileImage
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
                                            <p className="text-[13px]/4 h-10 font-medium text-center text-gray-900">
                                                {searchUser.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {results.length > 0 ? (
                            results.map((user) => (
                                <Link
                                    to={`/profile/${user.slug}`}
                                    key={user.id}
                                    onClick={() => addSearch(user.slug)}
                                    className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="w-11 h-11 mr-2">
                                        {user?.profileImage ? (
                                            <img
                                                src={user.profileImage}
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
                            ))
                        ) : query.length > 0 ? (
                            <div className="p-3 flex items-center justify-center w-full gap-1.5">
                                <TbSearchOff className="w-4 h-4 text-gray-500" />
                                <p className="text-gray-500 text-sm">
                                    Sonuç bulunamadı.
                                </p>
                            </div>
                        ) : (
                            <div className="p-3 flex items-center justify-center w-full gap-1.5">
                                <TbSearch className="w-4 h-4 text-gray-500" />
                                <p className="text-gray-500 text-sm">
                                    Arama yapmak için bir şeyler yazın.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchModal;
