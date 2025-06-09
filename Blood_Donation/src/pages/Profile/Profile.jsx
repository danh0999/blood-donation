import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button } from "antd";
import styles from "./styles.module.scss";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const donationHistory = useSelector(
    (state) => state.bloodHistory.donationHistory
  );
  const receiveHistory = useSelector(
    (state) => state.bloodHistory.receiveHistory
  );

  const [isDonationModalVisible, setDonationModalVisible] = useState(false);
  const [isReceiveModalVisible, setReceiveModalVisible] = useState(false);

  if (!user) {
    return <p className={styles.notice}>Bạn chưa đăng nhập.</p>;
  }

  const donationColumns = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Địa điểm", dataIndex: "location", key: "location" },
    { title: "Nhóm máu", dataIndex: "bloodType", key: "bloodType" },
  ];

  const receiveColumns = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Bệnh viện", dataIndex: "hospital", key: "hospital" },
    { title: "Nhóm máu", dataIndex: "bloodType", key: "bloodType" },
  ];

  return (
    <div className={styles.profileContainer}>
      <h2>Thông tin cá nhân</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Số điện thoại:</strong> {user.phone_number}
      </p>
      <p>
        <strong>Vai trò:</strong> {user.role}
      </p>

      <div className={styles.buttonGroup}>
        <Button type="primary" onClick={() => setDonationModalVisible(true)}>
          Lịch sử hiến máu
        </Button>
        <Button onClick={() => setReceiveModalVisible(true)}>
          Lịch sử nhận máu
        </Button>
      </div>

      <Modal
        title="Lịch sử hiến máu"
        open={isDonationModalVisible}
        onCancel={() => setDonationModalVisible(false)}
        footer={null}
      >
        <Table
          columns={donationColumns}
          dataSource={donationHistory}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      <Modal
        title="Lịch sử nhận máu"
        open={isReceiveModalVisible}
        onCancel={() => setReceiveModalVisible(false)}
        footer={null}
      >
        <Table
          columns={receiveColumns}
          dataSource={receiveHistory}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default Profile;
