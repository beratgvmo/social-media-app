import { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import {
    TbBookmark,
    TbMessage2,
    TbPhotoSquareRounded,
    TbUser,
} from "react-icons/tb";
import RightbarFollow from "@/components/RightbarFollow";
import { useParams } from "react-router-dom";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import Post from "@/components/post";
import { CgSpinner } from "react-icons/cg";
import ProfileSidebar from "@/components/ProfileSidebar";
import { Link } from "react-router-dom";
import Button from "@/components/button";

interface UserProfile {
    id: number;
    name: string;
    email: string;
    slug: string;
    profileImage: string;
    followerCount: number;
    followingCount: number;
}

interface Post {
    id: number;
    content: string;
    createdAt: string;
    postImages: PostImage[];
    user: User;
    likeCount: number;
    commetCount: number;
}

interface PostImage {
    id: number;
    url: string;
}

interface User {
    slug: string;
    profileImage: string;
    name: string;
    bio: string;
}

const Profile: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [profilePosts, setProfilePosts] = useState<Post[]>([]);
    const limit = 10;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/user/profile/${slug}`);
                setProfile(response.data);
                setProfilePosts([]);
                setPage(1);
                setHasMore(true);
            } catch (error) {
                console.error("Profil yüklenirken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProfile();
    }, [slug]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!hasMore || !profile?.slug || pageLoading) return;

            try {
                setPageLoading(true);
                const response = await axios.get(`/post/${profile.slug}`, {
                    params: { page, limit },
                });
                const newPosts: Post[] = response.data;

                setProfilePosts((prevPosts) => [...prevPosts, ...newPosts]);
                if (newPosts.length < limit) setHasMore(false);
            } catch (error) {
                console.error("Gönderiler yüklenirken hata oluştu:", error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchPosts();
    }, [page, profile?.slug]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight =
                document.documentElement.scrollHeight ||
                document.body.scrollHeight;
            const clientHeight =
                document.documentElement.clientHeight || window.innerHeight;

            if (
                scrollTop + clientHeight >= scrollHeight - 5 &&
                hasMore &&
                !pageLoading
            ) {
                setPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pageLoading, hasMore]);

    if (loading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="flex gap-5">
            <ProfileSidebar />
            <div className="w-[570px]">
                <div className="bg-white rounded-lg border">
                    <div className="relative">
                        <div className="rounded-t-lg bg-gray-400 w-full h-48" />
                        <TbPhotoSquareRounded className="bg-white text-blue-500 rounded-full absolute top-4 right-4 w-8 h-8 p-1 hover:text-blue-700 transition cursor-pointer" />
                        <div className="absolute -bottom-14 w-32 h-32 bg-white rounded-full left-5 group">
                            {profile?.profileImage ? (
                                <img
                                    src={profile.profileImage}
                                    alt="Profil Resmi"
                                    className="w-full h-full rounded-full border-4 bg-white border-white"
                                />
                            ) : (
                                <div className="flex justify-center items-center w-full h-full bg-gray-200 rounded-full border-4 border-white">
                                    <TbUser size={90} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex px-5  justify-between">
                        <div className="mt-9 py-6">
                            <p className="text-2xl font-medium mb-1">
                                {profile?.name}
                            </p>

                            <div className="text-sm mb-2.5 text-gray-600">
                                Bilgisayar mühendisi
                            </div>
                            <div className="flex gap-2 text-sm">
                                <Link to={"/mynetwork/follower"}>
                                    <p className="font-medium text-blue-500 transition hover:underline cursor-pointer">
                                        {profile?.followerCount} takipçi
                                    </p>
                                </Link>
                                <p className="font-medium text-blue-500">•</p>
                                <Link to={"/mynetwork/follower"}>
                                    <p className="font-medium text-blue-500 transition hover:underline cursor-pointer">
                                        {profile?.followingCount} takip
                                    </p>
                                </Link>
                            </div>
                        </div>

                        <div className="mt-3 flex items-start">
                            <Button variant="rounded">Takip Et</Button>
                        </div>
                    </div>
                </div>

                {profilePosts.length > 0 ? (
                    <div className="w-full mt-6 mb-4 bg-white border border-b-0 rounded-t-lg">
                        {profilePosts.map((post) => (
                            <Post
                                id={post.id}
                                content={post.content}
                                likeCount={post.likeCount}
                                createdAt={post.createdAt}
                                images={post.postImages}
                                key={post.id}
                                commetCount={post.commetCount}
                                user={post.user}
                                border={false}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-col mt-8">
                        <TbMessage2 className="text-5xl bg-white p-2.5 rounded-full border-2 border-gray-800 text-gray-800 mb-2" />
                        <p className="text-gray-800 font-medium text-lg">
                            Gönderi bulunamadı
                        </p>
                    </div>
                )}

                {pageLoading && (
                    <div className="w-full flex justify-center items-center h-20">
                        <CgSpinner
                            className="animate-spin text-blue-600"
                            size={45}
                        />
                    </div>
                )}
            </div>
            <div className="w-[270px]">
                <RightbarFollow />
            </div>
        </div>
    );
};

export default Profile;
