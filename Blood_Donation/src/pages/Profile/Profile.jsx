import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import styles from "../Profile/styles.module.scss";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // quay về trang chủ
  };

  if (!user) {
    return <p>Bạn chưa đăng nhập.</p>;
  }

  return (
    <div className={styles["profile-container"]}>
      <h2>Thông tin cá nhân</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
};

export default Profile;
