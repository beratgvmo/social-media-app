import React, { useEffect, useState, useCallback } from "react";
import axios from "@/utils/axiosInstance";
import Post from "@/components/post";
import { Post as PostType } from "@/types";

interface postSaved {
    id: number;
    createdAt: Date;
    post: PostType;
}

const PostSaved: React.FC = () => {
    const [postSave, setPostSave] = useState<postSaved[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const limit = 10;

    const fetchPostSaved = useCallback(async () => {
        if (!hasMore || pageLoading) return;

        try {
            setPageLoading(true);
            const response = await axios.get("post-saved/all", {
                params: { page, limit },
            });

            if (response.data && Array.isArray(response.data)) {
                const newPosts = response.data;
                setPostSave((prev) => [...prev, ...newPosts]);
                if (newPosts.length < limit) setHasMore(false);
            } else {
                console.error("Unexpected data format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching saved posts:", error);
        } finally {
            setPageLoading(false);
        }
    }, [hasMore, pageLoading, page, limit]);

    useEffect(() => {
        fetchPostSaved();
    }, [fetchPostSaved]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight =
                document.documentElement.scrollHeight ||
                document.body.scrollHeight;
            const clientHeight =
                document.documentElement.clientHeight || window.innerHeight;

            if (
                scrollTop + clientHeight >= scrollHeight - 5 &&
                hasMore &&
                !pageLoading
            ) {
                setPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pageLoading, hasMore]);

    console.log(postSave);

    return (
        <div className="w-full">
            <div className="px-4 py-3 bg-white rounded-lg border mb-3">
                <p>Kaydedilen ögeler</p>
                <p className="text-sm text-gray-600">
                    Kaydettiğiniz her şey gizlidir.
                </p>
            </div>
            {postSave.length > 0 ? (
                postSave.map((savedPost) => (
                    <Post
                        id={savedPost.post.id}
                        content={savedPost.post.content}
                        likeCount={savedPost.post.likeCount}
                        createdAt={savedPost.post.createdAt}
                        images={savedPost.post.postImages || []}
                        key={savedPost.id}
                        commentCount={savedPost.post.commentCount}
                        postUser={savedPost.post.user}
                        border={true}
                        codeContent={savedPost.post.codeContent}
                        codeLanguage={savedPost.post.codeLanguage}
                        codeTheme={savedPost.post.codeTheme}
                        githubApiUrl={savedPost.post.githubApiUrl}
                        githubType={savedPost.post.githubType}
                    />
                ))
            ) : (
                <p className="text-gray-600 text-center text-sm">
                    Kayıtlı herhangi bir gönderi yok
                </p>
            )}
            {pageLoading && <p>Yükleniyor...</p>}
        </div>
    );
};

export default PostSaved;
