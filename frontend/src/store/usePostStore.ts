import { create } from "zustand";
import axios from "../utils/axiosInstance";

interface Post {
    id: number;
    content: string;
    createdAt: string;
    postImages: PostImage[];
    user: User;
    likeCount: number;
}

interface PostImage {
    id: number;
    url: string;
}

interface User {
    slug: string;
    profileImage: string;
    name: string;
}

interface PostState {
    homePosts: Post[];
    profilePosts: Post[];
    loading: boolean;
    hasMore: boolean;
    setProfilePosts: (newPosts: Post[]) => void;
    fetchHomePosts: (page: number, limit: number) => Promise<void>;
    fetchProfilePosts: (
        page: number,
        limit: number,
        userSlug: string
    ) => Promise<void>;
}

const usePostStore = create<PostState>((set) => ({
    homePosts: [],
    profilePosts: [],
    loading: false,
    hasMore: true,

    fetchHomePosts: async (page: number, limit: number) => {
        set({ loading: true });
        try {
            const response = await axios.get("/post", {
                params: { page, limit },
            });
            const newPosts: Post[] = response.data;
            set((state) => ({
                homePosts: [...state.homePosts, ...newPosts],
                hasMore: newPosts.length === limit,
            }));
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            set({ loading: false });
        }
    },

    fetchProfilePosts: async (
        page: number,
        limit: number,
        userSlug: string
    ) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/post/${userSlug}`, {
                params: { page, limit },
            });

            const newPosts: Post[] = response.data;

            set((state) => ({
                profilePosts: [...state.profilePosts, ...newPosts],
                hasMore: newPosts.length === limit,
            }));
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            set({ loading: false });
        }
    },

    setProfilePosts: (newPosts: Post[]) =>
        set((state) => ({
            profilePosts: [...newPosts, ...state.profilePosts],
        })),
}));

export default usePostStore;
