import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import ImageCropper from "../components/ImageCropper";
import {
    TbBookmark,
    TbCloudUpload,
    TbMessage2,
    TbPhotoEdit,
    TbPhotoSquareRounded,
    TbUser,
} from "react-icons/tb";
import Modal from "../components/Modal";
import Button from "../components/Button";
import RightbarFollow from "../components/RightbarFollow";
import ProfileSkeleton from "../components/ProfileSkeleton";
import Post from "@/components/post";
import { CgSpinner } from "react-icons/cg";
import SettingsSidebar from "../components/SettingsSidebar";
import usePostStore from "../store/usePostStore";
import BannerCropper from "@/components/bannerCropper";
import { Link } from "react-router-dom";

const MyProfile: React.FC = () => {
    const { logout, user, setUser } = useAuthStore();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
    const [croppedBanner, setCroppedBanner] = useState<Blob | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalBannerOpen, setIsModalBannerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        profilePosts,
        profileFetchPosts,
        profilePageInc,
        profileScrollPosition,
        setProfileScrollPosition,
        profileHasMore,
        profileLoading,
        profilePage,
    } = usePostStore();

    useEffect(() => {
        window.scrollTo(0, profileScrollPosition);
    }, [profileScrollPosition]);

    useEffect(() => {
        profileFetchPosts(user.slug);
    }, [profilePage]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;

            if (
                scrollTop + clientHeight >= scrollHeight - 100 &&
                profileHasMore &&
                !profileLoading
            ) {
                profilePageInc();
            }

            setProfileScrollPosition(scrollTop);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [profileHasMore, profileLoading]);

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

    const handleBannerUpload = async () => {
        if (!croppedBanner) return;

        const formData = new FormData();
        formData.append("banner", croppedBanner);
        handleCloseBannerModal();

        setSelectedBanner(null);

        try {
            const response = await axios.post(
                "user/profile/banner-image",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setUser({ ...user!, bannerImage: response.data.imageUrl });
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

    const onImageBannerChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedBanner(imageUrl);
        }
    };

    const onCropComplete = (cropped: Blob | null) => {
        setCroppedImage(cropped);
    };

    const onCropCompleteBanner = (cropped: Blob | null) => {
        setCroppedBanner(cropped);
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    const handleOpenBannerModal = () => setIsModalBannerOpen(true);
    const handleCloseBannerModal = () => {
        setIsModalBannerOpen(false);
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

            <Modal
                isOpen={isModalBannerOpen}
                onClose={handleCloseBannerModal}
                title="Banner Yükle"
                maxWidth="2xl"
            >
                <div className="pt-5 px-6">
                    {!selectedBanner && (
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
                                    onChange={onImageBannerChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    )}
                    {selectedBanner && (
                        <BannerCropper
                            imageSrc={selectedBanner}
                            onCropComplete={onCropCompleteBanner}
                        />
                    )}
                </div>
                <div className="mt-6 bg-white py-3 px-6 flex gap-2 justify-end border-t rounded-b-xl">
                    <Button
                        onClick={handleBannerUpload}
                        disabled={!selectedBanner}
                        className="bg-blue-600 text-white focus:ring-blue-500 hover:bg-blue-700 active:bg-blue-800"
                    >
                        Banneri kaydet
                    </Button>
                </div>
            </Modal>
            <div className="flex gap-5">
                <SettingsSidebar />
                <div className="w-[570px]">
                    <div className="bg-white rounded-lg border">
                        <div className="relative">
                            <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
                                {user.bannerImage ? (
                                    <img
                                        src={user.bannerImage}
                                        alt="User banner"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="bg-gray-400 w-full h-full"></div>
                                )}

                                <button
                                    onClick={handleOpenBannerModal}
                                    className="absolute top-4 right-4 w-8 h-8 p-1 bg-white text-blue-500 rounded-full hover:text-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Edit banner"
                                >
                                    <TbPhotoSquareRounded className="w-full h-full" />
                                </button>
                            </div>

                            <div className="absolute -bottom-12 w-32 h-32 bg-white rounded-full left-5 group">
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
                        <div className="flex px-5 justify-between">
                            <div className="mt-7 pt-6 pb-4">
                                <p className="text-2xl font-medium mb-0.5">
                                    {user?.name}
                                </p>

                                <div className="text-sm mb-1.5 text-gray-600">
                                    {user?.bio}
                                </div>
                                <div className="flex gap-2 text-sm">
                                    <Link to={"/mynetwork/follower"}>
                                        <p className="font-medium text-blue-500 transition hover:underline cursor-pointer">
                                            {user?.followerCount} takipçi
                                        </p>
                                    </Link>
                                    <p className="font-medium text-blue-500">
                                        •
                                    </p>
                                    <Link to={"/mynetwork/follower"}>
                                        <p className="font-medium text-blue-500 transition hover:underline cursor-pointer">
                                            {user?.followingCount} takip
                                        </p>
                                    </Link>
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
                                Gönderi bulunmakta
                            </p>
                        </div>
                    )}

                    {profileLoading && (
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
        </>
    );
};

export default MyProfile;
