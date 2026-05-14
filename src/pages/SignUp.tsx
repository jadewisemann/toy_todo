import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { Button, Input, Label, Card, useToast } from "../components";
import { useAuth } from "../hooks";

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccessTransition, setIsSuccessTransition] = useState(false);
  const { signUp, signIn, isSigningIn, isSigningUp, isAuthenticated } = useAuth();

  if (isAuthenticated && !isSuccessTransition) {
    return <Navigate to="/todos" replace />;
  }

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp({ username, password, nickname, email }, {
      onSuccess: () => {
        setIsSuccessTransition(true);
        toast("회원가입이 완료되었습니다. 자동으로 로그인합니다.", { type: "success", duration: 5000 });
        setTimeout(() => {
          signIn(
            { username, password },
            {
              onSuccess: () => {
                setTimeout(() => {
                  navigate("/todos");
                }, 2000);
              },
              onError: (err) => {
                setIsSuccessTransition(false);
                toast(err.message || "자동 로그인에 실패했습니다. 직접 로그인해주세요.", { type: "error" });
                navigate("/signin");
              }
            }
          );
        }, 500);
      },
      onError: (err) => {
        toast(err.message || "회원가입에 실패했습니다.", { type: "error" });
      }
    });
  };

  const isLoading = isSigningUp || isSigningIn || isSuccessTransition;

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-40 bg-white/40 backdrop-blur-[1px]" />
      )}
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 relative z-10">
      <Card className="w-full max-w-sm">
        <Card.Header className="text-center">
          <Card.Title className="text-2xl">Sign Up</Card.Title>
          <Card.Description>Create a new account to get started.</Card.Description>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "처리 중..." : "Sign Up"}
            </Button>
          </form>
        </Card.Content>
        <Card.Footer className="flex justify-center">
          <Link to="/signin" className="text-sm text-blue-600 hover:underline">
            Already have an account? Sign in
          </Link>
        </Card.Footer>
      </Card>
      </div>
    </>
  );
};
