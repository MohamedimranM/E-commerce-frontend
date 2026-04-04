import _axios from "@/lib/axios";
import type { AuthResponse, SignInPayload, SignUpPayload } from "@/types";

export const signInService = async (data: SignInPayload) => {
  return await _axios<AuthResponse>("POST", "/auth/signin", data);
};

export const signUpService = async (data: SignUpPayload) => {
  return await _axios<AuthResponse>("POST", "/auth/signup", data);
};
