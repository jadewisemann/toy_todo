export type User = {
  id: string;
  name: string;
};

export type SignInRequest = {
  id: string;
  password: string;
};

export type SignUpRequest = SignInRequest & {
  name: string;
};

export type AuthResponse = {
  user: User;
};
