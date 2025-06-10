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
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AppHeader from "../layouts/components/Header/Header";
import { Outlet, Navigate } from "react-router-dom";
import AppFooter from "../layouts/components/Footer/Footer";
import BloodDonationForm from "../components/Blood-Form/Blood-Donation-Form/BloodDonationForm";
import BloodReceiveForm from "../components/Blood-Form/Blood-Receive-Form/BloodReceiveForm";
import StaffDashboard from "../pages/Staff/StaffDashboard";

const routes = [
  {
    path: "",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "form-register", element: <BloodDonationForm /> },
      { path: "form-receive", element: <BloodReceiveForm /> },
      { path: "information", element: <Information /> },
      { path: "news", element: <News /> },
      { path: "news/:id", element: <NewsDetail /> },
      { path: "contact", element: <Contact /> },

      // 👇 Optional: Nếu chưa dùng admin thì có thể comment lại

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

  {
    path: "staff",
    element: <ProtectedRoute allowedRoles={["STAFF"]} />,
    children: [
      {
        index: true,
        // Auto navigate to staff/overview
        element: <Navigate to='overview' replace />
      },

      {
        path: "overview",
        element: <StaffDashboard/>
      }
    ]
  },

  {
    path: "admin",
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
    ],
  },
];

export default routes;
