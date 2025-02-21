import React, { useEffect, useState, useCallback } from "react";
import axios from "@/utils/axiosInstance";
import Post from "@/components/post";
import RightbarFollow from "@/components/rightbarFollow";
import SettingsSidebar from "@/components/settingsSidebar";
import { Post as PostType } from "@/types";

const PostSaved: React.FC = () => {
    const [postSave, setPostSave] = useState<PostType[]>([]);
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

    return (
        <div className="flex gap-5">
            <SettingsSidebar />
            <div className="w-[570px]">
                <div className="px-4 py-3 bg-white rounded-lg border mb-3">
                    <p>Kaydedilen ögeler</p>
                    <p className="text-sm text-gray-600">
                        Kaydettiğiniz her şey gizlidir.
                    </p>
                </div>
                {postSave.length > 0 ? (
                    postSave.map((savedPost) => (
                        <Post
                            id={savedPost.id}
                            content={savedPost.content}
                            likeCount={savedPost.likeCount}
                            createdAt={savedPost.createdAt}
                            images={savedPost.postImages || []}
                            key={savedPost.id}
                            commentCount={savedPost.commentCount}
                            postUser={savedPost.user}
                            border={true}
                            codeContent={savedPost.codeContent}
                            codeLanguage={savedPost.codeLanguage}
                            codeTheme={savedPost.codeTheme}
                            githubApiUrl={savedPost.githubApiUrl}
                            githubType={savedPost.githubType}
                        />
                    ))
                ) : (
                    <p className="text-gray-600 text-center text-sm">
                        Kayıtlı herhangi bir gönderi yok
                    </p>
                )}
                {pageLoading && <p>Yükleniyor...</p>}
            </div>
            <div className="w-[270px]">
                <RightbarFollow />
            </div>
        </div>
    );
};

export default PostSaved;
