import React, { useState } from "react";
import {
  DashboardOutlined,
  FormOutlined,
  FileTextOutlined,
  DropboxOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
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

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const items = [
    getItem("Dashboard", "dashboard", <DashboardOutlined />),

    getItem("Blog Management", "blog", <FileTextOutlined />),

    getItem("Blood Requests", "blood-requests", <FormOutlined />),

    getItem("Donation Forms", "donation-forms", <FormOutlined />),

    getItem("Blood Inventory", "blood-inventory", <DropboxOutlined />),

    getItem("Logout", "logout", <LoginOutlined />),
  ];
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      // Xử lý logout
      toast.success("Logged out successfully");
      navigate("/login");
    } else {
      setSelectedMenuItem(key);
    }
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          selectedKeys={[selectedMenuItem]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[
              { title: "Staff" },
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
              <h2>Welcome to Staff Dashboard</h2>
            )}
            {selectedMenuItem === "blog" && <h2>Welcome to Blog Management</h2>}
            {selectedMenuItem === "blood-requests" && (
              <h2>Welcome to Blood Requests</h2>
            )}
            {selectedMenuItem === "donation-forms" && (
              <h2>Welcome to Donation Forms</h2>
            )}
            {selectedMenuItem === "blood-inventory" && (
              <h2>Welcome to Blood Inventory</h2>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Blood Bank Management System ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default StaffDashboard;
