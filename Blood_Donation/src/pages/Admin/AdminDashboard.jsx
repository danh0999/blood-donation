import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  FileSearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, message } from "antd";
import styles from "./styles.module.scss";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  const items = [
    getItem("Dashboard", "dashboard", <DashboardOutlined />),

    getItem("Blood Requisition", "blood-requisition", <FileSearchOutlined />),

    getItem("Emergency Donors", "emergency-donors", <TeamOutlined />),

    getItem("Logout", "logout", <LoginOutlined />),
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      // Handle logout
      message.success("Logged out successfully");
      navigate("/login");
    } else {
      setSelectedMenuItem(key);
      // Here you would add navigation to other routes if needed
      // For example: navigate(`/admin/${key}`);
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
        <Header className= {styles.header}>
          <h1 className={styles.headerTitle}>Admin Dashboard</h1>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[
              { title: "Admin" },
              {
                title:
                  items.find((item) => item.key === selectedMenuItem)?.label ||
                  "Dashboard",
              },
            ]}
          />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {selectedMenuItem === "dashboard" && (
              <h2>Welcome to Admin Dashboard</h2>
            )}
            {selectedMenuItem === "view-requests" && (
              <div>Blood Requisition Requests List</div>
            )}
            {selectedMenuItem === "create-request" && (
              <div>Create New Blood Requisition Form</div>
            )}
            {selectedMenuItem === "update-request" && (
              <div>Update Blood Requisition Request</div>
            )}
            {selectedMenuItem === "delete-request" && (
              <div>Delete Blood Requisition Request</div>
            )}
            {selectedMenuItem === "search-donors" && (
              <div>Search Emergency Donors</div>
            )}
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
