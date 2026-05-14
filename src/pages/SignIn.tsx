import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { Button, Input, Label, Card } from "../components";
import { useAuth } from "../hooks";

export const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isSigningIn, isAuthenticated, authError } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from || "/todos";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn({ username, password }, { onSuccess: () => {} });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
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
            {authError && <p className="text-sm font-medium text-red-500">{authError.message}</p>}
            <Button type="submit" disabled={isSigningIn} className="w-full">
              {isSigningIn ? "Signing In..." : "Sign In"}
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
  );
};
