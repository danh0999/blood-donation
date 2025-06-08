import React from "react";
import { useSelector } from "react-redux";
import styles from "../Profile/styles.module.scss";

const Profile = () => {
  const user = useSelector((state) => state.user);

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
        <strong>Phone Number:</strong> {user.phone_number}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
    </div>
  );
};

export default Profile;
