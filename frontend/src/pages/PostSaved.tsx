import Post from "@/components/post";
import RightbarFollow from "@/components/RightbarFollow";
import SettingsSidebar from "@/components/settingsSidebar";
import axios from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";

const PostSaved: React.FC = () => {
    const [postSave, setPostSave] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const limit = 10;

    const fetchPostSaved = async () => {
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
                console.error("Beklenmeyen veri formatı:", response.data);
            }
        } catch (error) {
            console.error("Kayıtlı gönderiler alınırken hata oluştu:", error);
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchPostSaved();
    }, [page]);

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
                    postSave.map((item) => {
                        const {
                            id,
                            content,
                            likeCount,
                            createdAt,
                            postImages,
                            commetCount,
                            user,
                        } = item.post || {};
                        return (
                            <Post
                                id={id}
                                content={content}
                                likeCount={likeCount}
                                createdAt={createdAt}
                                images={postImages || []}
                                key={item.id}
                                commentCount={commetCount}
                                user={user}
                                border={true}
                            />
                        );
                    })
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
