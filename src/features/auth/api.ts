import { apiRequest } from "@/lib/api-client";
import type {
  AuthResponse,
  SignInRequest,
  SignUpRequest,
  User,
} from "./types";

export const fetchMe = async (): Promise<User | null> => {
  try {
    const data = await apiRequest<AuthResponse>("/auth/me", {
      parseError: false,
    });
    return data.user;
  } catch {
    return null;
  }
};

export const signIn = (data: SignInRequest): Promise<AuthResponse> =>
  apiRequest<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const signUp = (data: SignUpRequest): Promise<AuthResponse> =>
  apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const signOut = (): Promise<null> =>
  apiRequest<null>("/auth/signout", {
    method: "POST",
  });
