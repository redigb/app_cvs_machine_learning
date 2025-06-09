import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
import { State, Actions } from '../types/typesAuth';

export const useAuthStore = create(persist<State & Actions>((set) => ({
    token: "",
    profile: null,
    isAuth: false,
    setToken: (token: string) => set(() => ({
        token,
        isAuth: !!token,
    })),
    setProfile: (profile: any) => set(() => ({
        profile
    })),
    logout: () => set(() => ({
        token: "",
        isAuth: false,
        profile: null,
    }))
}),{
    name: "auth-storage",
}));