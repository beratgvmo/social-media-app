import { useAuthStore } from "../store/useAuthStore";

const RightbarFollow: React.FC = () => {
    const { user } = useAuthStore();
    return (
        <div className="w-[300px]">
            <div className="bg-white w-full px-4 py-3 rounded-lg border">
                <p className="text-sm font-medium">
                    Sizin için daha fazla profil
                </p>
                <div className="flex gap-1 mt-3 border-b pb-4">
                    {user?.profileImage && (
                        <img
                            src={user.profileImage}
                            alt="Profil Resmi"
                            className="w-12 h-12 rounded-full border-4 bg-white border-white"
                        />
                    )}
                    <div className="">
                        <p className="font-medium text-gray-800">
                            Ahmet Karademir
                        </p>
                        <p className="text-gray-700 text-sm">
                            Junior Frontend Developer | JavaScript | React | Vue
                            | SASS...
                        </p>
                        <button className="border-2 mt-2 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 hover:border-gray-400 transition">
                            Takip Et
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightbarFollow;
