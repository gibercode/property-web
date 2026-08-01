import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ApiResponse } from "../types/api";
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types/auth";
import { fetchService } from "../utils/fetch-service";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  clearSession: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  me: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<User>;
  setSession: (accessToken: string, user: User) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      clearSession: () => {
        set({ accessToken: null, user: null });
      },
      login: async (payload) => {
        const { response } = await fetchService.request<ApiResponse<AuthUser>>(
          "/auth/login",
          {
            data: payload,
            method: "POST",
          },
        );
        const { accessToken, ...user } = response;

        set({ accessToken, user });
      },
      me: async () => {
        const { accessToken } = get();

        if (!accessToken) {
          set({ user: null });
          return;
        }

        try {
          const { response } = await fetchService.request<ApiResponse<User>>(
            "/auth/me",
            {
              token: accessToken,
            },
          );

          set({ user: response });
        } catch (error) {
          set({ accessToken: null, user: null });
          throw error;
        }
      },
      register: async (payload) => {
        const { response } = await fetchService.request<ApiResponse<User>>(
          "/auth/register",
          {
            data: payload,
            method: "POST",
          },
        );

        return response;
      },
      setSession: (accessToken, user) => {
        set({ accessToken, user });
      },
    }),
    {
      name: "inmo:auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);
