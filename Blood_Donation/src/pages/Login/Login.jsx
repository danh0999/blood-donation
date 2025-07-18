import React from "react";
import AuthenTemplate from "../../components/Authen-Template/Authen-Template";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function Login() {
  const user = useSelector((state) => state.user); // ✅ dùng đúng selector

  if (user) {
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/admin" replace />;
      case "MEMBER":
        return <Navigate to="/" replace />;
      case "STAFF":
        return <Navigate to="/staff" replace />;
      case "HOSPITAL_STAFF":
        return <Navigate to="/hospital" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <AuthenTemplate isLogin={true} />;
}

export default Login;
