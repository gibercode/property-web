import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ApiResponse } from "../types/api";
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  UpdateMePayload,
  User,
} from "../types/auth";
import { fetchService } from "../utils/fetch-service";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  clearSession: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  me: () => Promise<User | null>;
  deactivateMe: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<User>;
  setSession: (accessToken: string, user: User) => void;
  updateMe: (payload: UpdateMePayload) => Promise<User>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      clearSession: () => {
        set({ accessToken: null, user: null });
        localStorage.clear();
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
          return null;
        }

        try {
          const { response } = await fetchService.request<ApiResponse<User>>(
            "/auth/me",
            {
              token: accessToken,
            },
          );

          set({ user: response });
          return response;
        } catch (error) {
          set({ accessToken: null, user: null });
          throw error;
        }
      },
      deactivateMe: async () => {
        const { accessToken } = get();

        if (!accessToken) {
          set({ user: null });
          return;
        }

        await fetchService.request<ApiResponse<boolean>>("/usuarios/me", {
          method: "DELETE",
          token: accessToken,
        });
        set({ accessToken: null, user: null });
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
      updateMe: async (payload) => {
        const { accessToken } = get();

        if (!accessToken) {
          throw new Error("Sesion no disponible");
        }

        const { response } = await fetchService.request<ApiResponse<User>>(
          "/usuarios/me",
          {
            data: payload,
            method: "PATCH",
            token: accessToken,
          },
        );

        set({ user: response });

        return response;
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
