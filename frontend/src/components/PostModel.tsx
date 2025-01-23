import { useRef, useState, useEffect } from "react";
import Modal from "../components/Modal";
import EmojiPicker, { EmojiStyle, EmojiClickData } from "emoji-picker-react";
import ImageGrid from "../components/ImageGridUser";
import axios from "../utils/axiosInstance";
import { useForm } from "react-hook-form";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { HiOutlinePhoto } from "react-icons/hi2";
import { TbUserHeart } from "react-icons/tb";
import usePostStore from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";

import Button from "./Button";

interface PostFormInputs {
    content: string;
    images: FileList;
}

interface PostModelProps {
    isOpen: boolean;
    onClose: () => void;
}

const PostModel: React.FC<PostModelProps> = ({ isOpen, onClose }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(isOpen);
    const [postValue, setPostValue] = useState<string>("");
    const [postImages, setPostImages] = useState<string[]>([]);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const editableDivRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthStore();
    const { setProfilePosts } = usePostStore();
    const { register, handleSubmit, reset } = useForm<PostFormInputs>();

    useEffect(() => {
        setIsModalOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        return () => {
            postImages.forEach((image) => URL.revokeObjectURL(image));
        };
    }, [postImages]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPostValue("");
        setPostImages([]);
        if (editableDivRef.current) {
            editableDivRef.current.innerText = "";
        }
        onClose();
    };

    const onEmojiClick = (emojiData: EmojiClickData): void => {
        const updatedValue = postValue + emojiData.emoji;
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
            event.target.value = "";
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

        setIsLoading(true);
        try {
            const response = await axios.post("/post/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const newPost = response.data.post;
            setProfilePosts([newPost]);

            reset();
            handleCloseModal();
        } catch (error) {
            console.error("İçerik yüklenirken bir hata oluştu", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteImage = (index: number) => {
        const updatedImages = [...postImages];
        updatedImages.splice(index, 1);
        setPostImages(updatedImages);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Gönderi Oluşturma"
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
                            type="button"
                            onClick={() =>
                                setIsEmojiPickerOpen(!isEmojiPickerOpen)
                            }
                        >
                            <MdOutlineEmojiEmotions
                                className={`w-11 h-11 hover:bg-gray-200 transition p-2.5 rounded-full ${
                                    isEmojiPickerOpen && "bg-gray-200"
                                }`}
                            />
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
                                        multiple
                                    />
                                </label>
                            </div>
                        )}

                        <TbUserHeart className="w-11 h-11 hover:bg-gray-200 transition p-2.5 rounded-full" />
                    </div>
                </div>
                <div className="mt-6 bg-white py-3 px-6 flex gap-2 justify-end border-t rounded-b-xl">
                    <Button
                        disabled={postValue === "" || isLoading}
                        type="submit"
                        className="bg-blue-600 text-white focus:ring-blue-500 hover:bg-blue-700 active:bg-blue-800"
                    >
                        {isLoading ? "Yükleniyor..." : "Paylaş"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default PostModel;
