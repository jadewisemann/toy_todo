import { useCallback } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { AppLayout } from "../components/AppLayout";
import { AuthRoute } from "./AuthRoute";
import { appRoutes } from "./routes";

export const AppRouter = () => {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    isLoading,
    isSigningOut,
    signOut,
    userName,
  } = useAuthSession();

  const handleSignOut = useCallback(() => {
    signOut(undefined, {
      onSuccess: () => navigate("/signin", { replace: true }),
    }); 
  }, [navigate, signOut]);

  return (
    <Routes>
      <Route element={
          <AppLayout
            isAuthenticated={isAuthenticated}
            isSigningOut={isSigningOut}
            onSignOut={handleSignOut}
            userName={userName}
          />
      }>
        {
          appRoutes.map(({ element, mode, path }) => (
            <Route
              element={
                <AuthRoute
                  isAuthenticated={isAuthenticated}
                  isLoading={isLoading}
                  mode={mode}
                >
                  {element}
                </AuthRoute>
              }
              key={path}
              path={path}
            />
          ))
        }
        <Route element={<Navigate replace to="/todos" />} path="*" />
      </Route>
    </Routes>
  );
};
