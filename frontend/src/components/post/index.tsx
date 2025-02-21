import { useEffect, useRef, useState } from "react";
import {
    TbBookmark,
    TbBookmarkFilled,
    TbCheck,
    TbCopy,
    TbDots,
    TbEdit,
    TbMessageCircle,
    TbShare3,
    TbTrash,
    TbUser,
} from "react-icons/tb";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "@/utils/axiosInstance";
import axiosDefulat from "axios";
import PostImageGrid from "@/components/postImageGrid";
import TimeAgo from "@/components/TimeAgo";
import PostComment from "@/components/post/PostComment";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { GithubRepoView, GithubUserView } from "../postModel/githubRepoView";
import { GitHubRepo, GitHubUser } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import PostModel from "../postModel";

interface PostProps {
    id: number;
    likeCount: number;
    commentCount: number;
    createdAt: Date;
    postUser: User;
    border?: boolean;
    content: string;
    images: PostImage[];
    githubApiUrl?: string;
    githubType?: "user" | "repo";
    codeContent?: string;
    codeLanguage?: string;
    codeTheme?: "light" | "dark";
    isCommentBool?: boolean;
}

interface User {
    id: number;
    slug: string;
    profileImage: string;
    name: string;
    bio: string;
}

interface PostImage {
    id: number;
    url: string;
}

const Post: React.FC<PostProps> = ({
    id,
    content,
    images,
    createdAt,
    postUser,
    border,
    likeCount,
    commentCount,
    githubApiUrl,
    githubType,
    codeContent,
    codeLanguage,
    codeTheme,
    isCommentBool = false,
}) => {
    const [isLike, setIsLike] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [isComment, setIsComment] = useState<boolean>(isCommentBool);
    const [isBubble, setIsBubble] = useState(false);
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
    const bubbleRef = useRef<HTMLDivElement | null>(null);
    const [currentCommentCount, setCurrentCommentCount] =
        useState(commentCount);
    const [expanded, setExpanded] = useState(false);
    const [codeExpanded, setCodeExpanded] = useState(false);
    const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
    const [githubRepo, setGithubRepo] = useState<GitHubRepo | null>(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();

    const toggleExpanded = () => setExpanded(!expanded);
    const toggleCodeExpanded = () => setCodeExpanded(!codeExpanded);

    const incrementCommentCount = () => {
        setCurrentCommentCount((prevCount) => prevCount + 1);
    };

    const fetchLike = async () => {
        try {
            await axios.post(`/like/post/${id}`);
            setIsLike(true);
            setCurrentLikeCount(currentLikeCount + 1);
        } catch (error) {
            console.error("error", error);
        }
    };

    const fetchRemoveLike = async () => {
        try {
            await axios.delete(`/like/remove/post/${id}`);
            setIsLike(false);
            setCurrentLikeCount(currentLikeCount - 1);
        } catch (error) {
            console.error("error", error);
        }
    };

    const checkPostStatus = async () => {
        try {
            const response = await axios.get(`/like/status/post/${id}`);
            setIsLike(response.data.status);
            setCurrentLikeCount(response.data.count);
        } catch (error) {
            console.log(error);
        }
    };

    const savePost = async (postId: number) => {
        try {
            await axios.post(`/post-saved/${postId}`);
            setIsSave(!isSave);
        } catch (error) {
            console.error("Error saving post:", error);
        }
    };

    const checkSavePostStatus = async () => {
        try {
            const response = await axios.get(`/post-saved/status/${id}`);
            setIsSave(response.data.status);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkPostStatus();
        checkSavePostStatus();

        // if (githubType && githubApiUrl) {
        //     githubFetcher();
        // }
    }, []);

    const githubFetcher = async () => {
        setLoading(true);
        try {
            if (githubType == "user") {
                const response = await axiosDefulat.get(githubApiUrl);
                setGithubUser(response.data);
            } else if (githubType == "repo") {
                const response = await axiosDefulat.get(githubApiUrl);
                setGithubRepo(response.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                bubbleRef.current &&
                !bubbleRef.current.contains(event.target as Node)
            ) {
                setIsBubble(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Kopyalama hatası:", err);
        }
    };

    return (
        <>
            <div
                className={
                    border
                        ? "pt-3 pb-3 bg-white rounded-lg border mb-3"
                        : "pt-3 pb-3 bg-white rounded-t-lg border-b"
                }
            >
                <div className="flex justify-between">
                    <Link to={`/profile/${postUser.slug}`}>
                        <div className="flex gap-2.5 pl-3">
                            <div className="w-12 h-12 mt-1">
                                {postUser?.profileImage ? (
                                    <img
                                        src={postUser.profileImage}
                                        alt="Profil Resmi"
                                        className="w-full h-full rounded-full border"
                                    />
                                ) : (
                                    <div className="flex justify-center items-center w-full h-full bg-gray-200 rounded-full border-4 border-white">
                                        <TbUser />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <p className="font-medium m-0 p-0 -mb-[3px] -mt-0.5 text-[16px]">
                                    {postUser?.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {postUser.bio}
                                </p>
                                <p className="text-xs text-gray-500">
                                    <TimeAgo createdAt={createdAt} />
                                </p>
                            </div>
                        </div>
                    </Link>
                    {postUser.id == user.id && (
                        <div className="pr-4 relative" ref={bubbleRef}>
                            <button
                                onClick={() => setIsBubble(!isBubble)}
                                className="hover:bg-gray-100 p-1.5 rounded-full transition"
                            >
                                <TbDots />
                            </button>
                            {isBubble && (
                                <div className="absolute z-10 right-4 top-6 bg-white py-1 w-36 rounded-lg border shadow">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                        className="text-gray-800 w-full text-sm font-medium flex items-center px-3 py-2 hover:bg-gray-100"
                                    >
                                        <TbEdit className="mr-1" size={18} />
                                        Düzenle
                                    </button>
                                    <p className="text-gray-800 text-sm font-medium flex items-center px-3 py-2 hover:bg-gray-100">
                                        <TbTrash className="mr-1" size={18} />
                                        Kaldır
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-2.5 px-4">
                    <div className="text-base">
                        <p className="whitespace-pre-line">
                            {expanded ? content : content.slice(0, 100)}
                        </p>
                        {content.length > 100 && (
                            <span
                                onClick={toggleExpanded}
                                className="text-gray-400 text-xs cursor-pointer"
                            >
                                {expanded || "Devamını Oku"}
                            </span>
                        )}
                    </div>
                    {codeContent && (
                        <div
                            className={`border rounded p-2 mt-1.5 ${
                                codeTheme === "light"
                                    ? "bg-[#fff]"
                                    : "bg-[#0d1117]"
                            }`}
                        >
                            <div className="flex justify-between mx-2 mt-1 mb-2.5">
                                <p
                                    className={`text-xs ${
                                        codeTheme === "light"
                                            ? " text-gray-600"
                                            : " text-gray-100"
                                    }`}
                                >
                                    {codeLanguage}
                                </p>
                                <button onClick={handleCopy} className="">
                                    {copied ? (
                                        <div
                                            className={`flex items-center justify-center gap-0.5 text-xs ${
                                                codeTheme === "light"
                                                    ? " text-gray-600"
                                                    : " text-gray-100"
                                            }`}
                                        >
                                            <TbCheck />
                                            <p>Kopyalandı</p>
                                        </div>
                                    ) : (
                                        <div
                                            className={`flex items-center justify-center gap-0.5 text-xs ${
                                                codeTheme === "light"
                                                    ? " text-gray-600"
                                                    : " text-gray-100"
                                            }`}
                                        >
                                            <TbCopy />
                                            <p>Kopyala</p>
                                        </div>
                                    )}
                                </button>
                            </div>
                            <CodeMirror
                                value={
                                    codeExpanded
                                        ? codeContent
                                        : codeContent.slice(0, 500)
                                }
                                basicSetup={{
                                    lineNumbers: false,
                                    foldGutter: false,
                                    highlightActiveLine: false,
                                }}
                                extensions={[
                                    javascript({ jsx: true, typescript: true }),
                                ]}
                                theme={
                                    codeTheme === "light"
                                        ? githubLight
                                        : githubDark
                                }
                                readOnly={true}
                                editable={false}
                                className="custom-scrollbar ͼ1 text-sm"
                            />
                            {codeContent.length > 500 && (
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={toggleCodeExpanded}
                                        className="text-gray-400 hover:text-gray-500 transition mx-1 items-end text-xs cursor-pointer"
                                    >
                                        {codeExpanded || "Devamını Oku"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {loading || (
                    <div>
                        {githubUser && githubType == "user" && (
                            <div className="p-4">
                                <GithubUserView
                                    user={githubUser}
                                    button={false}
                                    deleteBtn={false}
                                />
                            </div>
                        )}

                        {githubRepo && githubType == "repo" && (
                            <div className="p-4">
                                <GithubRepoView
                                    repo={githubRepo}
                                    button={false}
                                    deleteBtn={false}
                                />
                            </div>
                        )}
                    </div>
                )}
                <div className="px-4 mt-2">
                    <PostImageGrid
                        postImages={images?.map((image) => image.url)}
                    />
                </div>
                <div className="px-4 flex justify-between mt-2">
                    <div className="flex gap-5">
                        {isLike ? (
                            <button
                                onClick={fetchRemoveLike}
                                className="flex items-center group"
                            >
                                <div className="w-8 h-8 p-1.5 rounded-full group-hover:bg-blue-100 transition mr-0.5">
                                    <AiFillLike className="w-full h-full text-blue-500 group-hover:text-blue-500 transition cursor-pointer" />
                                </div>
                                <p className="text-blue-500 text-sm font-medium transition">
                                    {currentLikeCount}
                                </p>
                            </button>
                        ) : (
                            <button
                                onClick={fetchLike}
                                className="flex items-center group"
                            >
                                <div className="w-8 h-8 p-1.5 rounded-full group-hover:bg-blue-100 transition mr-0.5">
                                    <AiOutlineLike className="w-full h-full text-gray-700 group-hover:text-blue-500 transition cursor-pointer" />
                                </div>
                                <p className="text-gray-700 group-hover:text-blue-500 text-sm font-medium transition">
                                    {currentLikeCount}
                                </p>
                            </button>
                        )}
                        <button
                            className="flex items-center group"
                            onClick={() => setIsComment(!isComment)}
                        >
                            <div className="w-8 h-8 p-1.5 rounded-full group-hover:bg-red-100 transition mr-0.5">
                                <TbMessageCircle className="w-full h-full text-gray-700 group-hover:text-red-500 transition cursor-pointer" />
                            </div>
                            <p className="text-gray-700 group-hover:text-red-500 text-sm font-medium transition">
                                {currentCommentCount}
                            </p>
                        </button>
                        <button className="w-8 h-8 p-1.5 rounded-full group hover:bg-green-100 transition">
                            <TbShare3 className="w-full h-full text-gray-700 group-hover:text-green-600 transition cursor-pointer" />
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => savePost(id)}
                            className="w-8 h-8 p-1.5 rounded-full hover:bg-gray-200 transition"
                        >
                            {isSave ? (
                                <TbBookmarkFilled className="w-full h-full text-gray-700 transition cursor-pointer" />
                            ) : (
                                <TbBookmark className="w-full h-full text-gray-700 transition cursor-pointer" />
                            )}
                        </button>
                    </div>
                </div>
                <PostComment
                    id={id}
                    isComment={isComment}
                    toggleComment={() => setIsComment(!isComment)}
                    onAddComment={incrementCommentCount}
                />
            </div>
            <PostModel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                content={content}
                images={images}
                postGithubApiUrl={githubApiUrl}
                postCodeContent={codeContent}
                postCodeLanguage={codeLanguage}
                postCodeTheme={codeTheme}
                postGithubType={githubType}
                variant="edit"
                postId={id}
            />
        </>
    );
};

export default Post;
