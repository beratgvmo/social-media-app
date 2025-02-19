import { TbUser } from "react-icons/tb";
import ProfileSidebar from "@/components/ProfileSidebar";
import Button from "@/components/button";
import axios from "@/utils/axiosInstance";
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
    const limit = 10;
    const { logout, user, setUser } = useAuthStore();

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
    }, [page, tab]);

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
        if (tab != isFollowers) {
            setTab(isFollowers);
            fetchProfile();
            setPage(1);
            setHasMore(true);
            isFollowers ? setFollowers([]) : setFollowings([]);
        }
    };

    const unfollow = async (id: number) => {
        try {
            console.log(id);
            await axios.delete(`/follower/unfollow/${id}`);

            setFollowings((prev) => prev.filter((user) => user.id !== id));
        } catch (error) {
            console.error(error);
        } finally {
            fetchProfile();
        }
    };

    const removeFollower = async (id: number) => {
        try {
            await axios.delete(`/follower/remove-follower/${id}`);
            setFollowers((prev) =>
                prev.filter((follower) => follower.id !== id)
            );
        } catch (error) {
            console.error(error);
        } finally {
            fetchProfile();
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await axios.get("/user/profile");
            setUser(response.data);
        } catch (error) {
            console.error("Profil yüklenirken bir hata oluştu", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const uniqueList = (list: UserFollow[]) => {
        return list.filter(
            (user, index, self) =>
                index === self.findIndex((u) => u.id === user.id)
        );
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
                        <div className="flex flex-col">
                            <p className="font-medium text-gray-800">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-700">
                                {user.bio || "Biyografi mevcut değil."}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2.5">
                        {/* <Button variant="outline">Mesaj</Button> */}
                        {tab ? (
                            <Button
                                variant="rounded"
                                onClick={() => removeFollower(user.id)}
                            >
                                Takip Çıkar
                            </Button>
                        ) : (
                            <Button
                                variant="rounded"
                                onClick={() => unfollow(user.id)}
                            >
                                Takip Çıkar
                            </Button>
                        )}
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
                            ? renderUserList(uniqueList(followers))
                            : renderUserList(uniqueList(followings))}
                        {/* {loading && !tab && user.followingCount > 0 && (
                            <SkeletonList
                                count={
                                    user.followingCount > 4
                                        ? 5
                                        : user.followingCount
                                }
                            />
                        )}
                        {loading && tab && user.followerCount > 0 && (
                            <SkeletonList
                                count={
                                    user.followerCount > 4
                                        ? 5
                                        : user.followerCount
                                }
                            />
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyNetworkFollower;
