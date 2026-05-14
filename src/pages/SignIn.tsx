import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { Button, Input, Label, Card, useToast } from "../components";
import { useAuth } from "../hooks";

export const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccessTransition, setIsSuccessTransition] = useState(false);
  const { signIn, isSigningIn, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const from = (location.state as any)?.from || "/todos";

  if (isAuthenticated && !isSuccessTransition) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn({ username, password }, { 
      onSuccess: () => {
        setIsSuccessTransition(true);
        toast("로그인에 성공했습니다.", { type: "success" });
        setTimeout(() => {
          navigate(from);
        }, 2000);
      },
      onError: (err) => {
        toast(err.message || "로그인에 실패했습니다.", { type: "error" });
      }
    });
  };

  return (
    <>
      {(isSigningIn || isSuccessTransition) && (
        <div className="fixed inset-0 z-40 bg-white/40 backdrop-blur-[1px]" />
      )}
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 relative z-10">
      <Card className="w-full max-w-sm">
        <Card.Header className="text-center">
          <Card.Title className="text-2xl">Sign In</Card.Title>
          <Card.Description>Enter your username and password.</Card.Description>
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
            <Button type="submit" disabled={isSigningIn || isSuccessTransition} className="w-full">
              {isSigningIn || isSuccessTransition ? "처리 중..." : "Sign In"}
            </Button>
          </form>
        </Card.Content>
        <Card.Footer className="flex justify-center">
          <Link to="/signup" className="text-sm text-blue-600 hover:underline">
            Don't have an account? Sign up
          </Link>
        </Card.Footer>
      </Card>
      </div>
    </>
  );
};
