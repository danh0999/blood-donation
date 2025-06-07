import React from "react";
import MainLayout from "../layouts/components/MainLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound/NotFound";
import Information from "../pages/Information/Information";
import { News } from "../pages/News/News";
import NewsDetail from "../pages/NewsDetail/NewsDetail";
import Profile from "../pages/Profile/Profile";
import ProtectedRoute from "./ProtectedRoute";
import { Contact } from "../pages/Contact/Contact";
import  AdminDashboard  from "../pages/Admin/AdminDashboard";

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
      { path: "news/:id", element: <NewsDetail /> },
      { path: "contact", element: <Contact /> },

      // 👇 Optional: Nếu chưa dùng admin thì có thể comment lại
      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
        ],
      },

      {
        path: "profile",
        element: <ProtectedRoute allowedRoles={["USER"]} />, // bảo vệ
        children: [
          {
            index: true,
            element: <Profile />, // hiển thị nếu đúng role

          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export default routes;
