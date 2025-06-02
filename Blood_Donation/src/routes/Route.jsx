import React from "react";
import MainLayout from "../layouts/components/MainLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound/NotFound";
import Information from "../pages/Information/Information";
import { News } from "../pages/News/News";
import Profile from "../pages/Profile/Profile"; // ⬅️ thêm trang Profile
import ProtectedRoute from "./ProtectedRoute"; // ⬅️ import ProtectedRoute

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "information", element: <Information /> },
      { path: "news", element: <News /> },

      // ✅ Sửa lại ProtectedRoute dùng children
      {
        path: "profile",
        element: <ProtectedRoute allowedRoles={["ROLE_USER"]} />, // 👈 Đây là route cha (bọc bảo vệ)
        children: [
          {
            index: true,
            element: <Profile />, // 👈 Đây là route con thực sự sẽ được render nếu role hợp lệ
          },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
];

export default routes;
