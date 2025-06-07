import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  console.log("USER in ProtectedRoute:", user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;
