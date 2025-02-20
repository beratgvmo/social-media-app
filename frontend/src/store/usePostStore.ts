import { Post } from "@/types";
import axios from "@/utils/axiosInstance";
import { create } from "zustand";

interface PostState {
    homePosts: Post[];
    page: number;
    hasMore: boolean;
    loading: boolean;
    fetchedPages: number[];
    scrollPosition: number;
    fetchPosts: () => Promise<void>;
    pageInc: () => void;
    setScrollPosition: (position: number) => void;

    profilePosts: Post[];
    profilePage: number;
    profileHasMore: boolean;
    profileLoading: boolean;
    profileFetchedPages: number[];
    profileScrollPosition: number;
    profileFetchPosts: (slug: string) => Promise<void>;
    profilePageInc: () => void;
    setProfileScrollPosition: (position: number) => void;
    setProfilePosts: (newPosts: Post[]) => void;
}

const usePostStore = create<PostState>((set, get) => ({
    homePosts: [],
    page: 1,
    hasMore: true,
    loading: false,
    fetchedPages: [],
    scrollPosition: 0,

    profilePosts: [],
    profilePage: 1,
    profileHasMore: true,
    profileLoading: false,
    profileFetchedPages: [],
    profileScrollPosition: 0,

    fetchPosts: async () => {
        const { page, hasMore, fetchedPages, homePosts } = get();
        const limit = 6;

        if (!hasMore || fetchedPages.includes(page)) return;

        set({ loading: true });
        try {
            const response = await axios.get(`/post`, {
                params: { page, limit },
            });
            const newPosts = response.data;

            set({
                homePosts: [...homePosts, ...newPosts],
                fetchedPages: [...fetchedPages, page],
                hasMore: newPosts.length === limit,
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            set({ loading: false });
        }
    },

    setProfilePosts: (newPosts: Post[]) => {
        const { profilePosts } = get();
        set({ profilePosts: [...newPosts, ...profilePosts] });
    },

    pageInc: () => set((state) => ({ page: state.page + 1 })),
    setScrollPosition: (position: number) => set({ scrollPosition: position }),

    profileFetchPosts: async (slug: string) => {
        const {
            profilePage,
            profileHasMore,
            profileFetchedPages,
            profilePosts,
        } = get();
        const limit = 6;

        if (!slug) {
            console.error("Slug is undefined");
            return;
        }

        if (!profileHasMore || profileFetchedPages.includes(profilePage))
            return;

        set({ profileLoading: true });
        try {
            const response = await axios.get(`/post/${slug}`, {
                params: { page: profilePage, limit },
            });
            const newPosts = response.data;

            set({
                profilePosts: [...profilePosts, ...newPosts],
                profileFetchedPages: [...profileFetchedPages, profilePage],
                profileHasMore: newPosts.length === limit,
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            set({ profileLoading: false });
        }
    },

    profilePageInc: () =>
        set((state) => ({ profilePage: state.profilePage + 1 })),

    setProfileScrollPosition: (position: number) =>
        set({ profileScrollPosition: position }),
}));

export default usePostStore;
