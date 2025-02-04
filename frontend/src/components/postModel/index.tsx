import { useRef, useState, useEffect } from "react";
import Modal from "@/components/Modal";
import ImageGrid from "@/components/ImageGridUser";
import axios from "@/utils/axiosInstance";
import { useForm } from "react-hook-form";
import usePostStore from "@/store/usePostStore";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import Button from "@/components/button";
import GitHubRepoFetcher from "@/components/postModel/gitHubFetcher";
import Code from "@/components/postModel/writingCode";
import { TbAlignJustified, TbCode, TbPhotoCircle } from "react-icons/tb";
import WritingText from "./writingText";
import ReactQuill from "react-quill";
import EmojiPickerModal from "./emojiPickerModal";

interface PostFormInputs {
    content: string;
    images: FileList;
}

interface PostModelProps {
    isOpen: boolean;
    onClose: () => void;
}

const PostModel: React.FC<PostModelProps> = ({ isOpen, onClose }) => {
    const [postValue, setPostValue] = useState<string>("");
    const [postImages, setPostImages] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [codeValue, setCodeValue] = useState<string>("");
    const { reset } = useForm<PostFormInputs>();
    const { setProfilePosts } = usePostStore();
    const [isWritingMode, setIsWritingMode] = useState(true);
    const [isModalGithubOpen, setIsModalGithubOpen] = useState<boolean>(false);

    const handleToggle = () => {
        setIsWritingMode(!isWritingMode);
        setCodeValue("");
        setPostValue("");
    };

    const handleCloseGithubModal = () => setIsModalGithubOpen(false);

    const handleOpenGithubModal = () => setIsModalGithubOpen(true);

    const handleCloseModal = () => {
        setPostValue("");
        setPostImages([]);
        onClose();
    };

    const handleInput = (value: string) => {
        setPostValue(value);
    };

    const handleCodeInput = (value: string) => {
        setCodeValue(value);
    };

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files);
            setPostImages((prevImages) => [...prevImages, ...newImages]);
        }
        event.target.value = "";
    };

    const handlePost = async () => {
        if (!postValue && !codeValue) return;

        const formData = new FormData();
        formData.append(
            "content",
            isWritingMode ? postValue.replace(/<\/?[^>]+(>|$)/g, "") : codeValue
        );

        formData.append("postType", isWritingMode ? "writing" : "code");

        postImages.forEach((image, index) => {
            formData.append("images", image, `image-${index}.png`);
        });

        setIsLoading(true);

        try {
            const response = await axios.post("/post/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setProfilePosts([response.data.post]);
            reset();
            handleCloseModal();
        } catch (error) {
            console.error(
                "Bilinmeyen bir hata oluştu:",
                error.response?.data || error
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteImage = (index: number) => {
        const updatedImages = [...postImages];
        updatedImages.splice(index, 1);
        setPostImages(updatedImages);
    };

    const addEmoji = (emoji: any) => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            const cursorPosition = range ? range.index : 0;
            editor.insertText(cursorPosition, emoji.native);
            setRange({
                index: cursorPosition + emoji.native.length,
                length: 0,
            });
            editor.setSelection(cursorPosition + emoji.native.length, 0);
        }
    };

    const quillRef = useRef<ReactQuill | null>(null);
    const [range, setRange] = useState<{
        index: number;
        length: number;
    } | null>(null);

    return (
        <Modal
            isOpen={isOpen}
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
                <div className={`${isWritingMode || "bg-[#282c34]"}`}>
                    <div className="px-2 mb-2 py-2 h-96 overflow-auto">
                        <div className="mb-2">
                            {isWritingMode ? (
                                <WritingText
                                    postValue={postValue}
                                    handleInput={handleInput}
                                    quillRef={quillRef}
                                    setRange={setRange}
                                />
                            ) : (
                                <Code
                                    codeValue={codeValue}
                                    handleInput={handleCodeInput}
                                />
                            )}
                        </div>
                        <div className="px-4 py-4">
                            <ImageGrid
                                handleDeleteImage={handleDeleteImage}
                                postImages={postImages}
                            />
                        </div>
                    </div>
                </div>
                <div className="px-6 flex justify-between">
                    <div className="flex gap-3.5">
                        <EmojiPickerModal
                            onEmojiSelectFunc={addEmoji}
                            isWritingMode={isWritingMode}
                        />

                        {postImages.length > 3 ? (
                            <div className="cursor-pointer hover:bg-gray-200 p-2.5 transition rounded-full">
                                <TbPhotoCircle className="w-7 h-7" />
                            </div>
                        ) : (
                            <label>
                                <div className="cursor-pointer hover:bg-gray-200 p-2.5 transition rounded-full">
                                    <TbPhotoCircle className="w-7 h-7" />
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    onChange={onImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                        <button
                            type="button"
                            onClick={handleOpenGithubModal}
                            className="cursor-pointer p-2.5 hover:bg-gray-200 transition rounded-full"
                        >
                            <FaGithub className="w-7 h-7" />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleToggle}
                        className="cursor-pointer flex items-center justify-center border p-1.5 rounded-md relative w-10 h-10"
                    >
                        <motion.span
                            key={isWritingMode ? "writing" : "code"}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute"
                        >
                            {isWritingMode ? (
                                <TbAlignJustified className="text-xl" />
                            ) : (
                                <TbCode className="text-xl" />
                            )}
                        </motion.span>
                    </button>
                </div>
                <div className="mt-3 bg-white py-3 px-6 flex gap-2 justify-end border-t rounded-b-xl">
                    <Button
                        disabled={
                            (isWritingMode ? postValue : codeValue) === "" ||
                            isLoading
                        }
                        type="submit"
                        className="bg-blue-600 text-white focus:ring-blue-500 hover:bg-blue-700 active:bg-blue-800"
                    >
                        {isLoading ? "Yükleniyor..." : "Paylaş"}
                    </Button>
                </div>
            </form>
            <GitHubRepoFetcher
                isOpen={isModalGithubOpen}
                onClose={handleCloseGithubModal}
            />
        </Modal>
    );
};

export default PostModel;
