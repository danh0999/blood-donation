import React from "react";
import MainLayout from "../layouts/components/MainLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound/NotFound"; // bạn tạo trang 404 này nhé
import Information from "../pages/Information/Information";
import { News } from "../pages/News/News";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />, // xử lý lỗi route hoặc lỗi UI
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "information", element: <Information /> },
      { path: "news", element: <News /> },
      { path: "*", element: <NotFound /> }, // catch-all cho 404
    ],
  },
];

export default routes;
