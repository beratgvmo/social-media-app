import { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import { TbMessage2, TbUser } from "react-icons/tb";
import { useParams } from "react-router-dom";
import Post from "@/components/post";
import { CgSpinner } from "react-icons/cg";
import FollowerBtn from "@/components/followerBtn";
import { PostImage, User } from "@/types";

interface UserProfile {
    id: number;
    name: string;
    email: string;
    slug: string;
    bio: string;
    isPrivate: boolean;
    profileImage: string | null;
    bannerImage: string | null;
    followerCount: number;
    followingCount: number;
}

interface Post {
    id: number;
    likeCount: number;
    commentCount: number;
    createdAt: Date;
    user: User;
    border?: boolean;
    content: string;
    postImages: PostImage[];
    githubApiUrl?: string;
    githubType?: "user" | "repo";
    codeContent?: string;
    codeLanguage?: string;
    codeTheme?: "light" | "dark";
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

    return (
        <div>
            <div className="bg-white rounded-lg border">
                <div className="relative">
                    {loading || !profile.bannerImage ? (
                        <div className="rounded-t-lg bg-gray-400 w-full h-48"></div>
                    ) : (
                        <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
                            {profile.bannerImage ? (
                                <img
                                    src={profile.bannerImage}
                                    alt="User banner"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="bg-gray-400 w-full h-full"></div>
                            )}
                        </div>
                    )}
                    {loading ? (
                        <div className="absolute -bottom-14 w-32 h-32 bg-white rounded-full left-5 group">
                            <div className="flex justify-center items-center w-full h-full bg-gray-200 rounded-full border-4 border-white">
                                <TbUser size={80} className="text-gray-600" />
                            </div>
                        </div>
                    ) : (
                        <div className="absolute -bottom-14 w-32 h-32 bg-white rounded-full left-5 group">
                            {profile?.profileImage ? (
                                <img
                                    src={profile.profileImage}
                                    alt="Profil Resmi"
                                    className="w-full h-full rounded-full border-4 bg-white border-white"
                                />
                            ) : (
                                <div className="flex justify-center items-center w-full h-full bg-gray-200 rounded-full border-4 border-white">
                                    <TbUser
                                        size={80}
                                        className="text-gray-600"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex px-5  justify-between">
                    <div className="mt-9 py-6">
                        {loading ? (
                            <div className="h-3 bg-gray-200 rounded-full w-40 mb-3.5 mt-2"></div>
                        ) : (
                            <p className="text-2xl font-medium mb-0.5">
                                {profile?.name}
                            </p>
                        )}
                        {loading ? (
                            <div className="h-2.5 bg-gray-200 rounded-full w-64 mb-3.5"></div>
                        ) : (
                            <div className="text-sm mb-1.5 text-gray-600">
                                {profile?.bio}
                            </div>
                        )}
                        {loading ? (
                            <div className="h-2.5 bg-gray-200 rounded-full  w-48"></div>
                        ) : (
                            <div className="flex gap-2 text-sm">
                                {/* <Link to={"/mynetwork/follower"}> */}
                                <p className="font-medium text-gray-600 transition">
                                    {profile?.followerCount} takipçi
                                </p>
                                {/* </Link> */}
                                <p className="font-medium text-gray-600">•</p>
                                {/* <Link to={"/mynetwork/follower"}> */}
                                <p className="font-medium text-gray-600 transition">
                                    {profile?.followingCount} takip
                                </p>
                                {/* </Link> */}
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="mt-2">
                            <div className="h-9 bg-gray-200 rounded-full w-20"></div>
                        </div>
                    ) : (
                        <div className="mt-2 flex items-start">
                            <FollowerBtn id={profile.id} />
                        </div>
                    )}
                </div>
            </div>

            {(loading || profilePosts.length > 0) && (
                <div className="w-full mt-6 mb-4 bg-white border border-b-0 rounded-t-lg">
                    {profilePosts.map((post) => (
                        <Post
                            content={post.content}
                            likeCount={post.likeCount}
                            createdAt={post.createdAt}
                            images={post.postImages}
                            commentCount={post.commentCount}
                            key={post.id}
                            postUser={post.user}
                            id={post.id}
                            border={false}
                            githubApiUrl={post.githubApiUrl}
                            githubType={post.githubType}
                            codeContent={post.codeContent}
                            codeLanguage={post.codeLanguage}
                            codeTheme={post.codeTheme}
                        />
                    ))}
                </div>
            )}

            {profilePosts.length > 0 || loading || (
                <div className="flex items-center justify-center flex-col mt-8">
                    <TbMessage2 className="text-5xl bg-white p-2.5 rounded-full border-2 border-gray-800 text-gray-800 mb-2" />
                    <p className="text-gray-800 font-medium text-lg">
                        Gönderi bulunamadı
                    </p>
                </div>
            )}

            {(pageLoading || loading) && (
                <div className="w-full flex justify-center items-center h-20">
                    <CgSpinner
                        className="animate-spin text-blue-600"
                        size={45}
                    />
                </div>
            )}
        </div>
    );
};

export default Profile;
