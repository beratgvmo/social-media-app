import React, { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import Post from "@/components/post";
import ProfileSidebar from "@/components/profileSidebar";
import RightbarFollow from "@/components/rightbarFollow";

interface Post {
    user: User;
    id: number;
    likeCount: number;
    commentCount: number;
    createdAt: Date;
    postUser: User;
    border?: boolean;
    content: string;
    postImages: PostImage[];
    githubApiUrl?: string;
    githubType?: "user" | "repo";
    codeContent?: string;
    codeLanguage?: string;
    codeTheme?: "light" | "dark";
}

interface PostImage {
    id: number;
    url: string;
}

interface User {
    id: number;
    name: string;
    bio: string;
    slug: string;
    profileImage: string;
}

const PostDetail: React.FC = () => {
    const { postId, slug } = useParams<{ postId: string; slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/post/${slug}/${postId}`);
                setPost(response.data);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Post not found");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId, slug, navigate]);

    return (
        <div>
            {post && (
                <Post
                    content={post.content}
                    likeCount={post.likeCount}
                    createdAt={post.createdAt}
                    images={post.postImages}
                    commentCount={post.commentCount}
                    key={post.id}
                    postUser={post.user}
                    id={post.id}
                    border={true}
                    githubApiUrl={post.githubApiUrl}
                    githubType={post.githubType}
                    codeContent={post.codeContent}
                    codeLanguage={post.codeLanguage}
                    codeTheme={post.codeTheme}
                    isCommentBool={true}
                />
            )}
        </div>
    );
};

export default PostDetail;
