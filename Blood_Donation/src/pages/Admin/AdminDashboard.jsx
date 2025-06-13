import React, { useState } from "react";
import { Layout, Menu, Breadcrumb, Pagination } from "antd";
import {
  PieChartOutlined,
  UserOutlined,
  FileOutlined,
} from "@ant-design/icons";
import styles from "./styles.module.scss";
import { Button } from "../../components/Button/Button";
import { MdAccountCircle } from "react-icons/md";
import { FaEye, FaEdit } from "react-icons/fa";
import SearchBarV2 from "../../components/SearchBarV2/SearchBarV2";
import AccountModal from "../../components/Account-Modal/AccountModal";
import "@ant-design/v5-patch-for-react-19";

import { RiDeleteBin5Fill } from "react-icons/ri";
import DeleteConfirmModal from "../../components/DeleteConfirmModal/DeleteConfirmModal";
const { Header, Content, Footer, Sider } = Layout;

// Hàm tạo item cho menu
function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

// Menu bên sidebar
const menuItems = [
  getItem("Tổng Quan", "overview", <PieChartOutlined />),
  getItem("Tài Khoản", "accounts", <UserOutlined />, [
    getItem("Danh Sách", "accounts-list"),
  ]),
  getItem("Báo Cáo", "reports", <FileOutlined />),
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      birthYear: 1990,
      gender: "Nam",
      role: "User",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      birthYear: 1985,
      gender: "Nữ",
      role: "Staff",
    },
    {
      id: 3,
      name: "Lê Thị Cẩm",
      birthYear: 1992,
      gender: "Nữ",
      role: "Staff Hospital",
    },
    {
      id: 4,
      name: "Phạm Văn Duy",
      birthYear: 1998,
      gender: "Nam",
      role: "User",
    },
    {
      id: 5,
      name: "Vũ Thị Hạnh",
      birthYear: 1995,
      gender: "Nữ",
      role: "Staff",
    },
    {
      id: 6,
      name: "Đặng Văn Hoàng",
      birthYear: 1989,
      gender: "Nam",
      role: "Staff Hospital",
    },
    {
      id: 7,
      name: "Hoàng Thị Lan",
      birthYear: 1991,
      gender: "Nữ",
      role: "User",
    },
    {
      id: 8,
      name: "Phan Văn Minh",
      birthYear: 1987,
      gender: "Nam",
      role: "Staff",
    },
    {
      id: 9,
      name: "Ngô Thị Nga",
      birthYear: 1993,
      gender: "Nữ",
      role: "Staff Hospital",
    },
    {
      id: 10,
      name: "Bùi Văn Quang",
      birthYear: 1996,
      gender: "Nam",
      role: "User",
    },
    {
      id: 11,
      name: "Trương Thị Phương",
      birthYear: 1990,
      gender: "Nữ",
      role: "Staff",
    },
    {
      id: 12,
      name: "Lý Văn Sơn",
      birthYear: 1988,
      gender: "Nam",
      role: "Staff Hospital",
    },
    {
      id: 13,
      name: "Đỗ Thị Thảo",
      birthYear: 1994,
      gender: "Nữ",
      role: "User",
    },
    {
      id: 14,
      name: "Phùng Văn Tuấn",
      birthYear: 1986,
      gender: "Nam",
      role: "Staff",
    },
    {
      id: 15,
      name: "Trịnh Thị Uyên",
      birthYear: 1997,
      gender: "Nữ",
      role: "Staff Hospital",
    },
    {
      id: 16,
      name: "Lâm Văn Vinh",
      birthYear: 1991,
      gender: "Nam",
      role: "User",
    },
    {
      id: 17,
      name: "Võ Thị Xuân",
      birthYear: 1993,
      gender: "Nữ",
      role: "Staff",
    },
    {
      id: 18,
      name: "Cao Văn Yến",
      birthYear: 1989,
      gender: "Nam",
      role: "Staff Hospital",
    },
    {
      id: 19,
      name: "Phan Thị Ánh",
      birthYear: 1995,
      gender: "Nữ",
      role: "User",
    },
    {
      id: 20,
      name: "Hồ Văn Bình",
      birthYear: 1990,
      gender: "Nam",
      role: "Staff",
    },
  ]);

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("overview");

  // Dùng cho lọc tìm kiếm & phân trang
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // State quản lý trang hiện tại của phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // số user hiển thị trên 1 trang

  // Thêm vào state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // "view" | "edit"
  const [selectedUser, setSelectedUser] = useState(null);

  // Xử lý khi click icon
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode("view");
    setModalVisible(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setModalVisible(true);
  };
  const handleSaveUser = (updatedData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedData.id ? { ...user, ...updatedData } : user
      )
    );
    setModalVisible(false);
  };

  // Dữ liệu giả lập user

  // Lọc user theo role và text search
  const filteredUsers = users.filter((user) => {
    const matchRole = roleFilter === "All" || user.role === roleFilter;
    const matchSearch = user.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchRole && matchSearch;
  });

  // Tính dữ liệu user cho trang hiện tại phân trang
  const startIndex = (currentPage - 1) * pageSize;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  // Khi chọn menu, đổi trang về trang đầu tiên
  const onMenuSelect = ({ key }) => {
    setSelectedKey(key);
    setCurrentPage(1);
  };

  // Breadcrumb
  const breadcrumbItems = [
    { title: "Trang Chủ" },
    { title: selectedKey === "accounts-list" ? "Danh Sách" : selectedKey },
  ];

  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const showDeleteConfirm = (id) => {
    setDeletingUserId(id);
    setConfirmDeleteVisible(true);
  };

  const handleConfirmDelete = () => {
    setUsers((prev) => prev.filter((user) => user.id !== deletingUserId));
    setConfirmDeleteVisible(false);
    setDeletingUserId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteVisible(false);
    setDeletingUserId(null);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className={styles.sider}
      >
        <div className={styles.logo}>ADMIN</div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["overview"]}
          mode="inline"
          items={menuItems}
          onSelect={onMenuSelect}
          selectedKeys={[selectedKey]}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <h1 className={styles.headerTitle}>Admin Dashboard</h1>
        </Header>
        <Content className={styles.content}>
          <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />

          {selectedKey === "overview" && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Tổng Quan Hệ Thống</h2>
              <div className={styles.statGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>
                    <span role="img" aria-label="users">
                      <MdAccountCircle />
                    </span>{" "}
                    128
                  </div>
                  <div className={styles.statLabel}>Tài Khoản</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>
                    <span role="img" aria-label="pending">
                      ⏳
                    </span>{" "}
                    5
                  </div>
                  <div className={styles.statLabel}> Chờ duyệt tài khoản</div>
                </div>
              </div>
            </section>
          )}

          {selectedKey === "accounts-list" && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Quản Lý Tài Khoản</h2>

              <SearchBarV2
                roles={["User", "Staff", "Staff Hospital"]}
                selectedRole={roleFilter}
                onRoleChange={(role) => {
                  setRoleFilter(role);
                  setCurrentPage(1); // reset trang khi đổi filter
                }}
                searchText={searchText}
                onSearchChange={(text) => {
                  setSearchText(text);
                  setCurrentPage(1); // reset trang khi đổi search
                }}
              />

              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ và tên</th>
                    <th>Năm sinh</th>
                    <th>Giới tính</th>
                    <th>Vai trò</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.birthYear}</td>
                        <td>{user.gender}</td>
                        <td>{user.role}</td>
                        <td
                          className={styles.actions}
                          style={{ marginLeft: "-9vw" }}
                        >
                          <FaEye
                            title="Xem"
                            className={styles.icon}
                            onClick={() => handleViewUser(user)}
                          />
                          <FaEdit
                            title="Sửa"
                            className={styles.icon}
                            onClick={() => handleEditUser(user)}
                          />
                          <RiDeleteBin5Fill
                            title="Xóa"
                            className={styles.icon}
                            onClick={() => showDeleteConfirm(user.id)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">Không tìm thấy kết quả phù hợp.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredUsers.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                style={{ marginTop: 16, textAlign: "right" }}
              />
            </section>
          )}

          {selectedKey === "reports" && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Giám Sát & Báo Cáo</h2>
              <div className={styles.actionGrid}>
                <div className={styles.buttonWrapper}>
                  <Button
                    content={
                      <>
                        <span role="img" aria-label="reports">
                          📊
                        </span>{" "}
                        Xem Báo Cáo
                      </>
                    }
                    to="/admin/reports"
                  />
                </div>
                <div className={styles.buttonWrapper}>
                  <Button
                    content={
                      <>
                        <span role="img" aria-label="history">
                          📜
                        </span>{" "}
                        Lịch Sử Dùng Máu
                      </>
                    }
                    to="/admin/blood-usage"
                  />
                </div>
              </div>
            </section>
          )}
        </Content>
        <AccountModal
          visible={modalVisible}
          mode={modalMode}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveUser}
          user={selectedUser}
        />
        <DeleteConfirmModal
          visible={confirmDeleteVisible}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />

        <Footer style={{ textAlign: "center" }}>
          ©2024 Admin Dashboard by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
