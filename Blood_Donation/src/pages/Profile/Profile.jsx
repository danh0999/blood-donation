import React from "react";
import { useAuth } from "../../hooks/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 24 }}>
      <h2>Thông tin cá nhân</h2>
      <p>
        <strong>Username:</strong> {user?.username}
      </p>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>Role:</strong> {user?.role}
      </p>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
};

export default Profile;
