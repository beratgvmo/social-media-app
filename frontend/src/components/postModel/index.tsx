import { useRef, useState } from "react";
import Modal from "@/components/Modal";
import ImageGrid from "@/components/ImageGridUser";
import axios from "@/utils/axiosInstance";
import { useForm } from "react-hook-form";
import usePostStore from "@/store/usePostStore";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import Button from "@/components/button";
import GitHubRepoFetcher from "@/components/postModel/gitHubFetcher";
import { TbCode, TbCodeOff, TbPhotoCircle } from "react-icons/tb";
import WritingText from "./writingText";
import ReactQuill from "react-quill";
import EmojiPickerModal from "./emojiPickerModal";
import WritingCode from "@/components/postModel/writingCode";
import { GitHubRepo, GitHubUser } from "@/types";
import { GithubRepoView, GithubUserView } from "./githubRepoView";
import PhotoModal from "./photoModal";

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
    const { reset } = useForm<PostFormInputs>();
    const { setProfilePosts } = usePostStore();
    const [isCode, setIsCode] = useState(false);
    const [isModalGithubOpen, setIsModalGithubOpen] = useState<boolean>(false);
    const quillRef = useRef<ReactQuill | null>(null);
    const [range, setRange] = useState<number | null>(null);

    const [photoModal, setPhotoModal] = useState(false);

    const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
    const [githubRepo, setGithubRepo] = useState<GitHubRepo | null>(null);
    const [githubType, setGithubType] = useState<"user" | "repo" | null>(null);
    const [githubApiUrl, setGithubApiUrl] = useState<string>("");

    const [codeValue, setCodeValue] = useState<string>("");
    const [theme, setTheme] = useState(true);
    const [codeLanguage, setCodeLanguage] = useState("code");

    const handleTheme = () => {
        setTheme(!theme);
    };

    const handleClosePhotoModal = () => {
        setPhotoModal(false);
    };

    const handleOpenPhotoModal = () => setPhotoModal(true);

    const handleGithubApi = (value: string) => {
        setGithubApiUrl(value);
    };

    const handleCodeLanguage = (value: string) => {
        setCodeLanguage(value);
    };

    const handleGithubDelete = () => {
        setGithubUser(null);
        setGithubRepo(null);
        setGithubType(null);
        setGithubApiUrl("");
    };

    const handleGithub = (
        value: GitHubUser | GitHubRepo | null,
        type: "user" | "repo"
    ) => {
        setGithubType(type);
        if (type === "user") {
            setGithubUser(value as GitHubUser);
        } else {
            setGithubRepo(value as GitHubRepo);
        }
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

    const imageUpdate = (file: File[]) => {
        setPostImages(file);
    };

    const handlePost = async () => {
        if (!postValue && !codeValue) return;

        const formData = new FormData();
        formData.append("content", postValue);

        if (codeValue) {
            formData.append("codeContent", codeValue);
            formData.append("codeLanguage", codeLanguage);
            formData.append("codeTheme", theme ? "light" : "dark");
        }

        if (githubApiUrl) {
            formData.append("githubApiUrl", githubApiUrl);
            formData.append("githubType", githubType);
        }

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

    const handleDeleteImage = () => {
        setPostImages([]);
    };

    const addEmoji = (emoji: { native: string }) => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            const cursorPosition = range ?? 0;
            editor.insertText(cursorPosition, emoji.native);
            setRange(cursorPosition + emoji.native.length);
            editor.setSelection(cursorPosition + emoji.native.length, 0);
        }
    };

    const handleCodeConet = () => {
        if (!(postImages.length > 0 || githubApiUrl)) {
            setIsCode(!isCode);
            setCodeValue("");
            setTheme(true);
            setCodeLanguage("code");
        }
    };

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
                <div>
                    <div className="px-2 mb-2 py-2 h-96 overflow-auto">
                        <div className="mb-2">
                            <WritingText
                                handleInput={handleInput}
                                quillRef={quillRef}
                                setRange={setRange}
                            />

                            {isCode && (
                                <WritingCode
                                    codeValue={codeValue}
                                    handleInput={handleCodeInput}
                                    handleCodeLanguage={handleCodeLanguage}
                                    codeLanguage={codeLanguage}
                                    handleTheme={handleTheme}
                                    theme={theme}
                                />
                            )}
                        </div>
                        <div className="px-4">
                            {githubUser && githubType == "user" && (
                                <GithubUserView
                                    user={githubUser}
                                    button={false}
                                    handleGithubDelete={handleGithubDelete}
                                />
                            )}

                            {githubRepo && githubType == "repo" && (
                                <GithubRepoView
                                    repo={githubRepo}
                                    button={false}
                                    handleGithubDelete={handleGithubDelete}
                                />
                            )}
                        </div>
                        <div className="px-4 py-4">
                            <ImageGrid
                                postImages={postImages}
                                handleDeleteImage={handleDeleteImage}
                                handleOpenPhotoModal={handleOpenPhotoModal}
                            />
                        </div>
                    </div>
                </div>
                <div className="px-6 mb-2">
                    <div className="flex gap-3.5 justify-between">
                        <EmojiPickerModal onEmojiSelectFunc={addEmoji} />
                        <div className="flex gap-4">
                            {postImages.length > 3 || isCode || githubApiUrl ? (
                                <div className="p-2.5 transition rounded-full">
                                    <TbPhotoCircle className="w-7 h-7 text-gray-400" />
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleOpenPhotoModal()}
                                    className="cursor-pointer hover:bg-gray-200 p-2.5 transition rounded-full"
                                >
                                    <TbPhotoCircle className="w-7 h-7" />
                                </button>
                            )}

                            {postImages.length > 0 || isCode || githubApiUrl ? (
                                <div className="p-2.5 transition rounded-full">
                                    <FaGithub className="w-7 h-7 text-gray-400" />
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleOpenGithubModal}
                                    className="cursor-pointer p-2.5 hover:bg-gray-200 transition rounded-full"
                                >
                                    <FaGithub className="w-7 h-7" />
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => handleCodeConet()}
                                className={`flex items-center justify-center border p-1.5 rounded-full relative w-10 h-10 ${
                                    !(postImages.length > 0 || githubApiUrl) &&
                                    "cursor-pointer"
                                }`}
                            >
                                <motion.span
                                    key={isCode.toString()}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute"
                                >
                                    {isCode ? (
                                        <TbCode className="text-xl" />
                                    ) : (
                                        <TbCodeOff
                                            className={`text-xl ${
                                                (postImages.length > 0 ||
                                                    githubApiUrl) &&
                                                "text-gray-400"
                                            }`}
                                        />
                                    )}
                                </motion.span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white py-3 px-6 flex gap-2 justify-end border-t rounded-b-xl">
                    <Button
                        disabled={postValue === "" || isLoading}
                        type="submit"
                        className="bg-blue-600 text-white focus:ring-blue-500 hover:bg-blue-700 active:bg-blue-800"
                    >
                        {isLoading ? "Yükleniyor..." : "Paylaş"}
                    </Button>
                </div>
            </form>
            <PhotoModal
                isOpen={photoModal}
                onClose={handleClosePhotoModal}
                images={postImages}
                setImages={imageUpdate}
            />
            <GitHubRepoFetcher
                isOpen={isModalGithubOpen}
                onClose={handleCloseGithubModal}
                handleGithub={handleGithub}
                handleGithubApi={handleGithubApi}
            />
        </Modal>
    );
};

export default PostModel;
