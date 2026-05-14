import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Todos } from "./pages/Todos";
import { useAuth } from "./hooks";

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return isAuthenticated ? <Navigate to="/todos" replace /> : <Outlet />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        
        <Route element={<PrivateRoute />}>
          <Route path="/todos" element={<Todos />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/todos" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
