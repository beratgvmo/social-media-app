import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import banner from "./banner.jpg";
import { TbPhotoSquareRounded, TbUser } from "react-icons/tb";
import RightbarFollow from "../components/RightbarFollow";
import { useParams, useNavigate } from "react-router-dom";
import ProfileSkeleton from "../components/ProfileSkeleton";

interface UserProfile {
    id: number;
    name: string;
    email: string;
    slug: string;
    profileImage: string;
    followerCount: number;
    followingCount: number;
}

const Profile: React.FC = () => {
    const { slug } = useParams();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="flex gap-5 mt-6">
            <div className="w-[800px]">
                <div className="bg-white rounded-lg border">
                    <div className="relative">
                        <div className="relative">
                            <div className="rounded-t-lg bg-gray-400 w-full h-52" />
                            <TbPhotoSquareRounded className="bg-white text-blue-500 rounded-full absolute top-4 right-4 w-8 h-8 p-1 hover:text-blue-700 transition cursor-pointer" />
                        </div>
                        <div className="absolute -bottom-12 w-40 h-40 bg-white rounded-full left-8 group">
                            {profile ? (
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
            </div>
            <RightbarFollow />
        </div>
    );
};

export default Profile;
