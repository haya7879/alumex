"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  authServices,
  LoginRequest,
  LoginResponse,
  AuthError,
} from "./auth-services";
import { useLocalStorageStore } from "@/store/use-local-storage-store";

/**
 * Hook for login mutation
 */
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useLocalStorageStore();

  return useMutation<LoginResponse, AuthError, LoginRequest>({
    mutationFn: authServices.login,
    onSuccess: (data) => {
      // Update user in store
      if (data.user) {
        setUser(data.user);
      }
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
      
      // Redirect to dashboard
      router.push("/sales/daily-follow-up");
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

/**
 * Hook for logout mutation
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useLocalStorageStore();

  return useMutation({
    mutationFn: authServices.logout,
    onSuccess: () => {
      // Clear token and user from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      
      // Clear user from store
      setUser(null);
      
      // Clear all queries
      queryClient.clear();
      
      // Redirect to login
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even if logout fails, clear local data and redirect
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setUser(null);
      queryClient.clear();
      router.push("/auth/login");
    },
  });
};
