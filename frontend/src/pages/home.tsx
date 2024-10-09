import { useRef, useState } from "react";

import { useAuthStore } from "../store/useAuthStore";
import { TbUser, TbUserHeart } from "react-icons/tb";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { HiOutlinePhoto } from "react-icons/hi2";
import axios from "../utils/axiosInstance";

import ProfileSidebar from "../components/ProfileSidebar";
import RightbarFollow from "../components/RightbarFollow";
import Modal from "../components/Modal";
import Button from "../components/Button";
import EmojiPicker, { EmojiStyle, EmojiClickData } from "emoji-picker-react";
import ImageGrid from "../components/ImageGridProps";
import { useForm } from "react-hook-form";
interface PostFormInputs {
    content: string;
    images: FileList;
}

const Home: React.FC = () => {
    const { user } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postValue, setPostValue] = useState<string>("");
    const [postImages, setPostImages] = useState<string[]>([]);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
    const editableDivRef = useRef<HTMLDivElement>(null);
    const { register, handleSubmit, reset } = useForm<PostFormInputs>();

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        editableDivRef == null;
        setPostValue("");
    };

    const onEmojiClick = (emojiData: EmojiClickData): void => {
        const updatedValue = postValue + emojiData.emoji.toString();
        setPostValue(updatedValue);
        if (editableDivRef.current) {
            editableDivRef.current.innerText = updatedValue;
        }
        setIsEmojiPickerOpen(false);
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>): void => {
        setPostValue(e.currentTarget.innerText || "");
    };

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {
            const newImages = Array.from(files).map((file) =>
                URL.createObjectURL(file)
            );
            setPostImages((prevImages) => [...prevImages, ...newImages]);
            event.target.value = ""; // Dosya seçimini temizle
        }
    };

    const handlePost = async () => {
        if (!postValue) return;

        const formData = new FormData();
        formData.append("content", postValue);

        for (let i = 0; i < postImages.length; i++) {
            const response = await fetch(postImages[i]);
            const blob = await response.blob();
            formData.append("images", blob, `image-${i}.png`);
        }

        try {
            const response = await axios.post("/post/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(response.data);
            reset();
            setPostImages([]);
            setPostValue("");
        } catch (error) {
            console.error("İçerik yüklenirken bir h ata oluştu", error);
        }
    };

    const handleDeleteImage = (index: number) => {
        const updatedImages = [...postImages];
        updatedImages.splice(index, 1);
        setPostImages(updatedImages);
    };

    return (
        <div className="flex gap-5 mt-6">
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Gönderi Olusturma"
                maxWidth="2xl"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handlePost();
                    }}
                >
                    <div>
                        <div className="px-5 py-4 h-96 overflow-auto">
                            <div className="relative mb-10">
                                <div
                                    className="w-full text-lg focus:outline-none"
                                    contentEditable="true"
                                    onInput={handleInput}
                                    role="textbox"
                                    aria-multiline="true"
                                    ref={editableDivRef}
                                    suppressContentEditableWarning={true}
                                ></div>
                                {postValue === "" && (
                                    <p className="absolute top-0 text-gray-500 text-lg select-none pointer-events-none">
                                        Ne hakkında konuşmak istiyorsunuz?
                                    </p>
                                )}
                            </div>
                            <ImageGrid
                                handleDeleteImage={handleDeleteImage}
                                postImages={postImages}
                            />
                        </div>

                        <div className="relative px-6 flex gap-3">
                            <button
                                onClick={() =>
                                    setIsEmojiPickerOpen(!isEmojiPickerOpen)
                                }
                            >
                                <MdOutlineEmojiEmotions className="w-11 h-11 hover:bg-gray-200 transition p-2.5 rounded-full" />
                            </button>
                            {isEmojiPickerOpen && (
                                <div className="absolute bottom-12 -left-36">
                                    <EmojiPicker
                                        height="330px"
                                        emojiStyle={EmojiStyle.GOOGLE}
                                        searchPlaceholder="Arama Yap"
                                        onEmojiClick={onEmojiClick}
                                        skinTonesDisabled={true}
                                    />
                                </div>
                            )}
                            {postImages.length > 3 ? (
                                <div>
                                    <HiOutlinePhoto className="w-11 h-11 p-2.5 rounded-full text-gray-400" />
                                </div>
                            ) : (
                                <div>
                                    <label>
                                        <div>
                                            <HiOutlinePhoto className="w-11 h-11 hover:bg-gray-200 transition p-2.5 rounded-full" />
                                        </div>
                                        <input
                                            id="dropzone-file"
                                            type="file"
                                            onChange={onImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            )}

                            <TbUserHeart className="w-11 h-11 hover:bg-gray-200 transition p-2.5 rounded-full" />
                        </div>
                    </div>
                    <div className="mt-6 bg-white py-3 px-6 flex gap-2 justify-end border-t rounded-b-xl">
                        <Button
                            disabled={postValue === ""}
                            type="submit"
                            className="bg-blue-600 text-white focus:ring-blue-500 hover:bg-blue-700 active:bg-blue-800"
                        >
                            Paylaş
                        </Button>
                    </div>
                </form>
            </Modal>
            <ProfileSidebar />
            <div className="w-[570px]">
                <div className="pt-4 px-4 pb-3 bg-white rounded-lg border mb-3">
                    <div className="mb-2.5 flex gap-3">
                        <div className="w-14">
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="Profil Resmi"
                                    className="w-12 h-12 ml-1 rounded-full border bg-white"
                                />
                            ) : (
                                <TbUser className="w-10 h-10 p-2 flex items-center border rounded-full text-blue-500" />
                            )}
                        </div>
                        <button
                            onClick={handleOpenModal}
                            className="w-full text-start transition px-4 border rounded-3xl border-gray-400 text-sm text-gray-600 font-medium focus:outline-none hover:bg-gray-200"
                        >
                            Gönderi Yazın
                        </button>
                    </div>
                    <div className="flex items-center justify-around">
                        <div className="flex items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                            <HiOutlinePhoto className="text-red-500 mr-1 w-5 h-5" />
                            <p className="font-medium text-red-500 text-sm">
                                Resim
                            </p>
                        </div>
                        <div className="flex items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                            <MdOutlineEmojiEmotions className="text-orange-500 mr-1 w-5 h-5" />
                            <p className="font-medium text-orange-500 text-sm">
                                Emoji
                            </p>
                        </div>
                        <div className="flex items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                            <TbUserHeart className="text-green-500 mr-1 w-5 h-5" />
                            <p className="font-medium text-green-500 text-sm">
                                Etiketle
                            </p>
                        </div>
                    </div>
                </div>
                <div className="border-b-2 border-gray-300"></div>
            </div>
            <RightbarFollow />
        </div>
    );
};

export default Home;
