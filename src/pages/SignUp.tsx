import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { Button, Input, Label, Card } from "../components";
import { useAuth } from "../hooks";

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, isSigningUp, isAuthenticated, authError } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/todos" replace />;
  }

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp({ username, password, nickname, email }, { 
      onSuccess: () => {
        navigate("/todos");
      } 
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
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
            {authError && <p className="text-sm font-medium text-red-500">{authError.message}</p>}
            <Button type="submit" disabled={isSigningUp} className="w-full">
              {isSigningUp ? "Signing Up..." : "Sign Up"}
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
  );
};
