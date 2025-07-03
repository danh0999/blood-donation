import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// Declare items that will be in the sidebar
  const items = [
    getItem("Tổng Quan", "overview", <PieChartOutlined />),
    getItem("Tài Khoản", "accounts", <TeamOutlined />),
    getItem("Báo Cáo", "reports", <FileOutlined />),
    getItem("Logout", "logout", <LogoutOutlined />),
  ];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const selectedMenuItem = location.pathname.split("/")[2]

  // Handle when the items declared above is clicked
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      toast.success("Logged out successfully");
      navigate("/login");
    } else {
      navigate(`/admin/${key}`);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className={styles.sider}
      >
        <Menu
          theme="dark"
          selectedKeys={[selectedMenuItem]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <h1 className={styles.headerTitle}>Admin Dashboard</h1>
        </Header>
        <Content style={{ margin: "0 16px" }}>       
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Hospital Blood Management System ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
