import { create } from "zustand";
import axios from "@/utils/axiosInstance";

interface FollowerState {
    isFollowing: Record<number, "accepted" | "pending" | null>;
    loadingFollow: Record<number, boolean>;
    checkFollowingStatus: (id: number) => Promise<void>;
    onFollow: (id: number) => Promise<void>;
    onUnfollow: (id: number) => Promise<void>;
}

export const useFollowerStore = create<FollowerState>((set) => ({
    isFollowing: {},
    loadingFollow: {},

    checkFollowingStatus: async (id) => {
        set((state) => ({
            loadingFollow: { ...state.loadingFollow, [id]: true },
        }));
        try {
            const response = await axios.get(`/follower/status/${id}`);
            set((state) => ({
                isFollowing: {
                    ...state.isFollowing,
                    [id]: response.data.isFollowing,
                },
            }));
        } catch (error) {
            console.error(error);
        } finally {
            set((state) => ({
                loadingFollow: { ...state.loadingFollow, [id]: false },
            }));
        }
    },

    onFollow: async (id) => {
        try {
            await axios.post(`/follower/follow/${id}`);
            await useFollowerStore.getState().checkFollowingStatus(id);
        } catch (error) {
            console.error(error);
        }
    },

    onUnfollow: async (id) => {
        try {
            await axios.delete(`/follower/unfollow/${id}`);
            await useFollowerStore.getState().checkFollowingStatus(id);
        } catch (error) {
            console.error(error);
        }
    },
}));
