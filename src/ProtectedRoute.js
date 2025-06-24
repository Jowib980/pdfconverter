import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from './components/Loader.js';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div><Loader /></div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
