import { Navigate, Outlet } from "react-router-dom";

// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ allowedRoles }) => {
const ProtectedRoute = () => {
  // const user = useSelector((state) => state.user);

  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  // if (allowedRoles && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
