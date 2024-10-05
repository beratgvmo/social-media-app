import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import { useForm } from "react-hook-form";
import ImageCropper from "../components/ImageCropper";
import banner from "./banner.jpg";
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

interface Post {
    id: number;
    text: string;
    likes: number;
    createdAt: string;
}

interface PostFormData {
    text: string;
}

const MyProfile: React.FC = () => {
    const { logout, user, setUser } = useAuthStore();
    const [posts, setPosts] = useState<Post[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, reset } = useForm<PostFormData>();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // await new Promise((resolve) => setTimeout(resolve, 200));
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
        if (user?.id) {
            fetchPosts();
        }
    }, [user?.id]);

    const fetchPosts = async () => {
        try {
            if (user?.id) {
                const postResponse = await axios.get(
                    `/post/user-all/${user.id}`
                );
                setPosts(postResponse.data);
            }
        } catch (error) {
            console.error("Mesajlar alınırken bir hata oluştu", error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("/auth/logout");
            logout();
        } catch (error) {
            console.error("Çıkış işlemi başarısız", error);
        }
    };

    const handlePostDelete = async (id: number) => {
        try {
            await axios.delete(`/post/delete/${id}`);
            setPosts(posts.filter((post) => post.id !== id));
        } catch (error) {
            console.error("Post silinirken bir hata oluştu", error);
        }
    };

    const onPost = async (data: PostFormData) => {
        try {
            const response = await axios.post("/post/create", data);
            setPosts([...posts, response.data]);
            reset();
        } catch (error) {
            setErrorMessage("Post oluşturulamadı.");
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
        <div className="flex gap-5 mt-6">
            <div className="w-[800px]">
                <div className="bg-white rounded-lg border">
                    <div className="relative">
                        <div className="relative">
                            <img src={banner} className="rounded-t-lg" />
                            <TbPhotoSquareRounded className="bg-white text-blue-500 rounded-full absolute top-4 right-4 w-8 h-8 p-1 hover:text-blue-700 transition cursor-pointer" />
                        </div>
                        <div className="absolute -bottom-12 w-40 h-40 bg-white rounded-full left-8 group">
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
                                <TbPhotoEdit className="text-white" size={25} />
                            </div>
                        </div>
                    </div>
                    <div className="py-6 mt-8 px-6 flex gap-16 items-center">
                        <Modal
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            title="Fotoğraf Yükle"
                            maxWidth="2xl"
                        >
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

                            <div className="mt-6 flex gap-2 justify-end">
                                <Button
                                    onClick={handleImageUpload}
                                    disabled={!croppedImage}
                                    className="bg-blue-600 text-white focus:ring-blue-500 hover:bg-blue-700 active:bg-blue-800"
                                >
                                    Fotoğrafı kaydet
                                </Button>
                            </div>
                        </Modal>
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <p className="text-2xl font-medium">
                                    {user?.name}
                                </p>
                            </div>
                            <div className="text-sm mb-3">Berat Güven</div>
                            <div className="flex gap-5 text-sm">
                                <p>12k takipçi</p>
                                <p>4 takip</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-8 p-6 bg-white rounded-lg border">
                    <form onSubmit={handleSubmit(onPost)}>
                        <div className="mb-4">
                            <input
                                {...register("text", {
                                    required: "Mesaj metni zorunludur",
                                })}
                                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Mesajınızı yazın"
                                type="text"
                            />
                        </div>
                        <button className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 font-semibold">
                            Gönder
                        </button>
                    </form>
                    {errorMessage && (
                        <p className="text-red-500 mt-2">{errorMessage}</p>
                    )}
                </div>

                <div className="w-full max-w-md mt-6">
                    {posts.length > 0 ? (
                        <ul>
                            {posts.map((post) => (
                                <li
                                    key={post.id}
                                    className="mb-4 p-4 bg-white rounded-lg shadow"
                                >
                                    <p className="text-lg">{post.text}</p>
                                    <p>Likes: {post.likes}</p>
                                    <small>
                                        {new Date(
                                            post.createdAt
                                        ).toLocaleString()}
                                    </small>
                                    <button
                                        onClick={() =>
                                            handlePostDelete(post.id)
                                        }
                                        className="ml-4 py-1 px-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No messages found.</p>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className="py-2 px-4 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
                >
                    Logout
                </button>
            </div>
            <RightbarFollow />
        </div>
    );
};

export default MyProfile;
