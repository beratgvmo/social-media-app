import { TbUser } from "react-icons/tb";
import ProfileSidebar from "../components/ProfileSidebar";
import Button from "../components/Button";
import axios from "../utils/axiosInstance";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface UserFollow {
    id: number;
    name: string;
    bio: string | null;
    profileImage: string | null;
    slug: string;
}

const SkeletonLoader = () => (
    <div className="flex animate-pulse px-4 border-t justify-between items-center py-3">
        <div className="flex items-center gap-2.5">
            <div className="w-14 h-14 p-2 border rounded-full bg-gray-200" />
            <div className="flex flex-col gap-2.5">
                <div className="w-32 bg-gray-300 h-2.5 rounded-full"></div>
                <div className="w-40 bg-gray-300 h-2 rounded-full"></div>
            </div>
        </div>
        <div className="flex gap-2.5">
            <div className="h-8 w-16 border-2 border-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded-full"></div>
        </div>
    </div>
);

const SkeletonList = ({ count }: { count: number }) => (
    <>
        {Array.from({ length: count }).map((_, idx) => (
            <SkeletonLoader key={idx} />
        ))}
    </>
);

const MyNetworkFollower: React.FC = () => {
    const [followers, setFollowers] = useState<UserFollow[]>([]);
    const [followings, setFollowings] = useState<UserFollow[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(true);
    const { user } = useAuthStore();
    const limit = 10;

    const fetchData = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const endpoint = tab
                ? `/follower/follower-all/${user.id}`
                : `/follower/following-all/${user.id}`;
            const response = await axios.get(endpoint, {
                params: { page, limit },
            });
            const data = tab
                ? response.data.followers
                : response.data.followings;

            if (data.length < limit) setHasMore(false);
            tab
                ? setFollowers((prev) => [...prev, ...data])
                : setFollowings((prev) => [...prev, ...data]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [user.id, page, tab, hasMore, loading, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;

            if (
                scrollTop + clientHeight >= scrollHeight - 100 &&
                hasMore &&
                !loading
            ) {
                setPage((prev) => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading]);

    const switchTab = (isFollowers: boolean) => {
        setTab(isFollowers);
        setPage(1);
        setHasMore(true);
        isFollowers ? setFollowers([]) : setFollowings([]);
    };

    const renderUserList = (list: UserFollow[]) =>
        list.length > 0 ? (
            list.map((user) => (
                <div
                    key={user.id}
                    className="flex px-4 border-t justify-between items-center py-3"
                >
                    <div className="flex items-center gap-2.5">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt="Profil Resmi"
                                className="w-14 h-14 rounded-full border bg-white"
                            />
                        ) : (
                            <TbUser className="w-14 h-14 p-2 flex items-center border rounded-full text-blue-500" />
                        )}
                        <div className="flex flex-col gap-1">
                            <p className="font-medium text-gray-800">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-700">
                                {user.bio || "Biyografi mevcut değil."}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2.5">
                        <Button variant="outline">Mesaj</Button>
                        <Button variant="rounded">Takip Çıkar</Button>
                    </div>
                </div>
            ))
        ) : (
            <p className="px-4 border-t py-3 text-gray-500">
                Henüz kullanıcı yok.
            </p>
        );

    return (
        <div className="flex gap-5">
            <ProfileSidebar />
            <div className="w-full">
                <div className="bg-white rounded-lg border w-full">
                    <div className="flex ml-3 gap-6 text-sm font-semibold">
                        <button
                            onClick={() => switchTab(true)}
                            className={`px-4 py-2.5 transition ${
                                tab
                                    ? "text-blue-500 border-b-2 border-blue-500"
                                    : "hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 "
                            }`}
                        >
                            {user.followerCount} Takipçi
                        </button>
                        <button
                            onClick={() => switchTab(false)}
                            className={`px-4 py-2.5 transition ${
                                !tab
                                    ? "text-blue-500 border-b-2 border-blue-500"
                                    : "hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
                            }`}
                        >
                            {user.followingCount} Takip Edilen
                        </button>
                    </div>
                    <div>
                        {tab
                            ? renderUserList(followers)
                            : renderUserList(followings)}
                        {loading && <SkeletonList count={5} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyNetworkFollower;
