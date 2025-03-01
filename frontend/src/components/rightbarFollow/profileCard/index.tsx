import { TbUser } from "react-icons/tb";
import { Link } from "react-router-dom";
import FollowerBtn from "@/components/followerBtn";

interface Friend {
    id: number;
    name: string;
    profileImage: string;
    slug: string;
    bio: string;
    loading: boolean;
}

const ProfileCard: React.FC<Friend> = ({
    id,
    name,
    profileImage,
    slug,
    bio,
    loading,
}) => {
    return (
        <div className="flex gap-3 mt-3 border-b pb-4 w-full">
            <Link to={`/profile/${slug}`}>
                {profileImage || !loading ? (
                    <img
                        src={profileImage}
                        alt="Profil Resmi"
                        className="w-12 h-12 rounded-full border"
                    />
                ) : (
                    <TbUser className="w-12 h-12 p-2 flex items-center border rounded-full text-blue-500" />
                )}
            </Link>
            <div className="w-[70%]">
                {loading ? (
                    <div>
                        <div className="h-3 bg-gray-200 rounded-full w-40 mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded-full w-40 mb-2"></div>
                    </div>
                ) : (
                    <Link to={`/profile/${slug}`}>
                        <p className="font-medium text-gray-800">{name}</p>
                        <p className="text-gray-700 text-xs mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                            {bio ? bio : "bio"}
                        </p>
                    </Link>
                )}
                <div>
                    <FollowerBtn id={id} />
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
