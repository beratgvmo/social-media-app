import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import ImageCropper from "../components/ImageCropper";
import {
    TbCloudUpload,
    TbPhotoEdit,
    TbPhotoSquareRounded,
    TbUser,
} from "react-icons/tb";
import Modal from "../components/Modal";
import Button from "../components/Button";
import RightbarFollow from "../components/RightbarFollow";
import ProfileSkeleton from "../components/ProfileSkeleton";
import Post from "../components/Post";
import { CgSpinner } from "react-icons/cg";
import SettingsSidebar from "../components/SettingsSidebar";

export interface Post {
    id: number;
    content: string;
    createdAt: string;
    postImages: PostImage[];
    user: User;
}

export interface PostImage {
    id: number;
    url: string;
}

export interface User {
    slug: string;
    profileImage: string;
    name: string;
}

const MyProfile: React.FC = () => {
    const { logout, user, setUser } = useAuthStore();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const limit = 1;
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
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

        fetchProfile();
    }, [setUser, logout]);

    useEffect(() => {
        const fetchPosts = async () => {
            setPageLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 100));
            try {
                const response = await axios.get(`/post/` + user?.slug, {
                    params: { page, limit },
                });
                const newPosts: Post[] = response.data;

                if (newPosts.length < limit) {
                    setHasMore(false);
                }

                setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setPageLoading(false);
            }
        };

        if (hasMore) {
            fetchPosts();
        }
    }, [page]);

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
            !loading
        ) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore]);

    const handleLogout = async () => {
        try {
            await axios.post("/auth/logout");
            logout();
        } catch (error) {
            console.error("Çıkış işlemi başarısız", error);
        }
    };

    const handleImageUpload = async () => {
        if (!croppedImage) return;

        const formData = new FormData();
        formData.append("profileImage", croppedImage);
        handleCloseModal();

        setSelectedImage(null);

        try {
            const response = await axios.post(
                "user/profile/upload-image",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setUser({ ...user!, profileImage: response.data.imageUrl });
        } catch (error) {
            console.error("Resim yüklenirken bir hata oluştu", error);
        }
    };

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const onCropComplete = (cropped: Blob | null) => {
        setCroppedImage(cropped);
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    if (loading) {
        return <ProfileSkeleton />;
    }

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Fotoğraf Yükle"
                maxWidth="2xl"
            >
                <div className="pt-5 px-6">
                    {!selectedImage && (
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-[360px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <TbCloudUpload className="w-8 h-8 mb-2 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">
                                            Resim Yüklemek için tıklayın
                                        </span>
                                    </p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    onChange={onImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    )}
                    {selectedImage && (
                        <ImageCropper
                            imageSrc={selectedImage}
                            onCropComplete={onCropComplete}
                        />
                    )}
                </div>
                <div className="mt-6 bg-white py-3 px-6 flex gap-2 justify-end border-t rounded-b-xl">
                    <Button
                        onClick={handleImageUpload}
                        disabled={!croppedImage}
                        className="bg-blue-600 text-white focus:ring-blue-500 hover:bg-blue-700 active:bg-blue-800"
                    >
                        Fotoğrafı kaydet
                    </Button>
                </div>
            </Modal>
            <div className="flex gap-5 mt-6">
                <SettingsSidebar />
                <div className="w-[570px]">
                    <div className="bg-white rounded-lg border">
                        <div className="relative">
                            <div className="relative">
                                <div className="rounded-t-lg bg-gray-400 w-full h-48" />
                                <TbPhotoSquareRounded className="bg-white text-blue-500 rounded-full absolute top-4 right-4 w-8 h-8 p-1 hover:text-blue-700 transition cursor-pointer" />
                            </div>
                            <div className="absolute -bottom-14 w-32 h-32 bg-white rounded-full left-4 group">
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profil Resmi"
                                        className="w-full h-full rounded-full border-4 bg-white border-white"
                                    />
                                ) : (
                                    <div className="flex justify-center items-center w-full h-full bg-gray-200 rounded-full border-4 border-white">
                                        <TbUser size={90} />
                                    </div>
                                )}
                                <div
                                    onClick={handleOpenModal}
                                    className="absolute cursor-pointer flex group-hover:opacity-100 opacity-0 top-0 justify-center items-center bg-black/50 w-full h-full rounded-full border-white border-4 transition-opacity duration-300"
                                >
                                    <TbPhotoEdit
                                        className="text-white"
                                        size={25}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="py-6 mt-8 px-6 flex gap-16 items-center">
                            <div>
                                <div className="flex items-center gap-4 mb-3">
                                    <p className="text-2xl font-medium">
                                        {user?.name}
                                    </p>
                                </div>
                                <div className="text-sm mb-3">Berat Güven</div>
                                <div className="flex gap-5 text-sm">
                                    <p>{user?.followerCount} takipçi</p>
                                    <p>{user?.followingCount} takip</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-6 mb-4 bg-white border border-b-0 rounded-t-lg">
                        {posts.length > 0 ? (
                            posts.map((post, index) => (
                                <Post
                                    id={post.id}
                                    content={post.content}
                                    likeCount="0"
                                    createdAt={post.createdAt}
                                    images={post.postImages}
                                    key={index}
                                    user={post.user}
                                    border={false}
                                />
                            ))
                        ) : (
                            <p>No messages found.</p>
                        )}
                    </div>
                    {pageLoading && (
                        <div className="w-full flex justify-center items-center h-20">
                            <CgSpinner
                                className="animate-spin text-blue-600"
                                size={45}
                            />
                        </div>
                    )}
                    {/* <button
                        onClick={handleLogout}
                        className="py-2 px-4 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
                    >
                        Logout
                    </button> */}
                </div>
                <RightbarFollow />
            </div>
        </>
    );
};

export default MyProfile;
