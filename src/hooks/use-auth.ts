"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { signInService, signUpService } from "@/services/auth.service";
import { store } from "@/store";
import { setCredentials } from "@/store/features/auth-slice";
import type { SignInPayload, SignUpPayload } from "@/types";

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignInPayload) => signInService(data),
    onSuccess: (data) => {
      toast.success(data?.message || "Welcome back!");
      store.dispatch(
        setCredentials({
          user: data.user,
          token: data.token,
        })
      );
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/products");
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message || err?.message || "Sign in failed"
      );
    },
  });
};

export const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignUpPayload) => signUpService(data),
    onSuccess: (data) => {
      toast.success(data?.message || "Account created! Please sign in.");
      router.push("/signin");
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message || err?.message || "Sign up failed"
      );
    },
  });
};
