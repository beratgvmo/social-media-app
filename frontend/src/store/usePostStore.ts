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
    setProfilePosts: (newPosts: Post[]) => void;
    setHomePosts: (newPosts: Post[]) => void;
}

const usePostStore = create<PostState>((set) => ({
    homePosts: [],
    profilePosts: [],

    setProfilePosts: (newPosts: Post[]) =>
        set((state) => ({
            profilePosts: [...newPosts, ...state.profilePosts],
        })),
    setHomePosts: (newPosts: Post[]) => {
        set(() => ({
            homePosts: newPosts,
        }));
    },
}));

export default usePostStore;
