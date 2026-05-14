import React, { useState } from "react";
import { Link, Navigate } from "react-router";
import { Button, Input, Label, Card } from "../components";
import { useAuth } from "../hooks";

export const SignUp = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, isSigningUp, isAuthenticated, authError } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/todos" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp({ id, name, password }, { onSuccess: () => {} });
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
              <Label htmlFor="id">ID</Label>
              <Input 
                id="id"
                value={id} 
                onChange={(e) => setId(e.target.value)} 
                placeholder="Enter your ID" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your name" 
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
