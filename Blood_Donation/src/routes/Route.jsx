import React from "react";
// import MainLayout from "../layouts/components/MainLayout";
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
import { Outlet } from "react-router-dom";
import AppFooter from "../layouts/components/Footer/Footer";
import BloodDonationForm from "../components/Blood-Form/Blood-Donation-Form/BloodDonationForm";
import BloodReceiveForm from "../components/Blood-Form/Blood-Receive-Form/BloodReceiveForm";
import StaffDashboard from "../pages/Staff/StaffDashboard";
import HospitalStaff_Dashboard from "../pages/Hospital_Staff/HospitalStaff_Dashboard";
import BloodDonate from "../components/BloodDonate/BloodDonate";
import { Content } from "antd/es/layout/layout";
import { Layout } from "antd";
import { History } from "../pages/History/History";
import { Schedule } from "../pages/Schedule/Schedule";

const routes = [
  {
    path: "",
    element: (
      <Layout style={{ minHeight: "100vh", paddingTop: 93 }}>
        <AppHeader />
        <Content>
          <Outlet />
        </Content>
        <AppFooter />
      </Layout>
    ),
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "bloodDonate", element: <BloodDonate /> },
      { path: "information", element: <Information /> },
      { path: "news", element: <News /> },
      { path: "news/:id", element: <NewsDetail /> },
      { path: "contact", element: <Contact /> },
      { path: "history", element: <History /> },
      { path: "schedule" ,element: <Schedule />}, 

      // 👇 Optional: Nếu chưa dùng admin thì có thể comment lại

      {
        path: "profile",
        element: <ProtectedRoute allowedRoles={["MEMBER"]} />, // bảo vệ
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
    path: "admin",
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: "staff",
    element: <ProtectedRoute allowedRoles={["STAFF"]} />,
    children: [
      {
        index: true,
        element: <StaffDashboard />,
      },
    ],
  },
  {
    path: "hospital",
    element: <ProtectedRoute allowedRoles={["HOSPITAL_STAFF"]} />,
    children: [
      {
        index: true,
        element: <HospitalStaff_Dashboard />,
      },
    ],
  },
];

export default routes;
