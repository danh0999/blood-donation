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
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import ManageAccount from "../pages/Admin/Accounts/ManageAccount";
import ManageProgram from "../pages/Admin/Programs/ManageProgram";
import AccountDetail from "../pages/Admin/Accounts/AccountDetail";
import AppHeader from "../layouts/components/Header/Header";
import { Outlet, Navigate } from "react-router-dom";
import AppFooter from "../layouts/components/Footer/Footer";
import BloodDonationForm from "../components/Blood-Form/Blood-Donation-Form/BloodDonationForm";
import BloodReceiveForm from "../components/Blood-Form/Blood-Receive-Form/BloodReceiveForm";
import StaffDashboard from "../pages/Staff/StaffDashboard";
import HospitalStaff_Dashboard from "../pages/Hospital_Staff/HospitalStaff_Dashboard";
import BloodDonate from "../pages/BloodDonate/BloodDonate";
import { Content } from "antd/es/layout/layout";
import { Layout } from "antd";
import { History } from "../pages/History/History";
import { Schedule } from "../pages/Donate/Schedule/Schedule";
import DonateContainer from "../pages/Donate/DonateContainer";
import DonateCheckup from "../pages/Donate/Checkup/DonateCheckup";
import { Event } from "../pages/Event/Event";

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
      { path: "information", element: <Information /> },
      { path: "news", element: <News /> },
      { path: "news/:id", element: <NewsDetail /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
      { path: "event", element: <Event /> },
    ],
  },

  {
    path: "user",
    element: (
      <Layout style={{ minHeight: "100vh", paddingTop: 93 }}>
        <AppHeader />
        <Content>
          <ProtectedRoute allowedRoles={["MEMBER"]}>
            <Outlet />
          </ProtectedRoute>
        </Content>
        <AppFooter />
      </Layout>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "bloodDonate", element: <BloodDonate /> },
      { path: "history", element: <History /> },
      { path: "information", element: <Information /> },
      { path: "news", element: <News /> },
      { path: "news/:id", element: <NewsDetail /> },
      { path: "contact", element: <Contact /> },
      {
        path: "donate",
        element: <DonateContainer />,
        children: [
          { path: "schedule", element: <Schedule /> },
          { path: "checkup", element: <DonateCheckup /> },
          { index: true, element: <Navigate to="schedule" /> },
        ],
      },
      { path: "event", element: <Event /> },
    ],
  },

  {
    path: "admin",
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
        children: [
          { index: true, element: <div>Welcome to Admin Dashboard</div> },
          { path: "overview", element: <div>Overview tab</div>},
          { path: "accounts", element: <ManageAccount />},
          { path: "accounts/:id", element: <AccountDetail /> },
          { path: "reports", element: <div>Report List</div> },
          { path: "programs", element: <ManageProgram /> },
        ],
      },
    ],
  },

  {
    path: "staff",
    element: <ProtectedRoute allowedRoles={["STAFF"]} />,
    children: [{ index: true, element: <StaffDashboard /> }],
  },

  {
    path: "hospital",
    element: <ProtectedRoute allowedRoles={["HOSPITAL_STAFF"]} />,
    children: [{ index: true, element: <HospitalStaff_Dashboard /> }],
  },
];

export default routes;
