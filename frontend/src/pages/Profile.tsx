import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import banner from "./banner.jpg";
import { TbMessage2, TbPhotoSquareRounded, TbUser } from "react-icons/tb";
import RightbarFollow from "../components/RightbarFollow";
import { useParams, useNavigate } from "react-router-dom";
import ProfileSkeleton from "../components/ProfileSkeleton";
import Post from "../components/Post";
import { CgSpinner } from "react-icons/cg";
import ProfileSidebar from "../components/ProfileSidebar";
import SettingsSidebar from "../components/SettingsSidebar";

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
}

interface PostImage {
    id: number;
    url: string;
}

interface User {
    slug: string;
    profileImage: string;
    name: string;
}

const Profile: React.FC = () => {
    const { slug } = useParams();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const limit = 10;
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [profilePosts, setProfilePosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/user/profile/${slug}`);
                const fetchedProfile = response.data;
                setProfile(fetchedProfile);
            } catch (error) {
                console.error("Profil yüklenirken bir hata oluştu", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [slug, navigate]);

    useEffect(() => {
        const fetchPosts = async () => {
            setPageLoading(true);
            try {
                const response = await axios.get(`/post/` + profile?.slug, {
                    params: { page, limit },
                });
                const newPosts = response.data;

                if (newPosts.length < limit) {
                    setHasMore(false);
                }

                setProfilePosts(newPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setPageLoading(false);
            }
        };

        if (hasMore) {
            fetchPosts();
        }
    }, [page, profile?.slug]);
    const handleScroll = () => {
        const scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight =
            document.documentElement.scrollHeight || document.body.scrollHeight;
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

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pageLoading, hasMore]);

    if (loading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="flex gap-5 mt-6">
            <SettingsSidebar />
            <div className="min-w-[570px]">
                <div className="bg-white rounded-lg border">
                    <div className="relative">
                        <div className="relative">
                            <div className="rounded-t-lg bg-gray-400 w-full h-52" />
                            <TbPhotoSquareRounded className="bg-white text-blue-500 rounded-full absolute top-4 right-4 w-8 h-8 p-1 hover:text-blue-700 transition cursor-pointer" />
                        </div>
                        <div className="absolute -bottom-12 w-40 h-40 bg-white rounded-full left-8 group">
                            {profile?.profileImage ? (
                                <img
                                    src={profile?.profileImage}
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
                    <div className="py-6 mt-8 px-6 flex gap-16 items-center">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <p className="text-2xl font-medium">
                                    {profile && profile.name}
                                </p>
                            </div>
                            <div className="text-sm mb-3">Berat Güven</div>
                            <div className="flex gap-5 text-sm">
                                <div className="flex gap-5 text-sm">
                                    <p>{profile?.followerCount} takipçi</p>
                                    <p>{profile?.followingCount} takip</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {profilePosts.length > 0 ? (
                    <div className="w-full mt-6 mb-4 bg-white border border-b-0 rounded-t-lg">
                        {profilePosts.map((post, index) => (
                            <Post
                                id={post.id}
                                content={post.content}
                                likeCount={post.likeCount}
                                createdAt={post.createdAt}
                                images={post.postImages}
                                key={index}
                                user={post.user}
                                border={false}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-col mt-8">
                        <TbMessage2 className="text-5xl bg-white p-2.5 rounded-full border-2 border-gray-800 text-gray-800 mb-2" />
                        <p className="text-gray-800 font-medium text-lg">
                            Gönderi bulunmakta
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
            <RightbarFollow />
        </div>
    );
};

export default Profile;
