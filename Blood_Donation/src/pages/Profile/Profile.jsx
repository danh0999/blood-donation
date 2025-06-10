import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Table, Button, Form, Input, Select } from "antd";
import { login } from "../../redux/features/userSlice"; // Đảm bảo đúng đường dẫn
import styles from "./styles.module.scss";
import { toast } from "react-toastify";

const { Option } = Select;

const Profile = () => {
  const user = useSelector((state) => state.user);
  const donationHistory = useSelector(
    (state) => state.bloodHistory.donationHistory
  );
  const receiveHistory = useSelector(
    (state) => state.bloodHistory.receiveHistory
  );
  const dispatch = useDispatch();

  const [isDonationModalVisible, setDonationModalVisible] = useState(false);
  const [isReceiveModalVisible, setReceiveModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);

  const [form] = Form.useForm();

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

  const handleUpdate = (values) => {
    const updatedUser = {
      ...user,
      ...values,
    };
    dispatch(login(updatedUser));
    toast.success("Cập nhật thông tin thành công!");
    setUpdateModalVisible(false);
  };

  return (
    <div className={styles.profileContainer}>
      <h2>Thông tin cá nhân</h2>
      <p>
        <strong>Fullname:</strong> {user.fullName}
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
        <Button
          type="dashed"
          onClick={() => {
            form.setFieldsValue({
              email: user.email || "",
              username: user.username || "",
              cccd: user.cccd || "",
              address: user.address || "",
              phone: user.phone_number || "",
              gender: user.gender || "",
              bloodType: user.bloodType || "",
            });
            setUpdateModalVisible(true);
          }}
        >
          Cập nhật thông tin
        </Button>
      </div>

      {/* Donation Modal */}
      <Modal
        title="Lịch sử hiến máu"
        open={isDonationModalVisible}
        onCancel={() => setDonationModalVisible(false)}
        footer={null}
        className={styles.modalStyle}
      >
        <Table
          columns={donationColumns}
          dataSource={donationHistory}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      {/* Receive Modal */}
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

      {/* Update User Info Modal */}
      <Modal
        title="Cập nhật thông tin cá nhân"
        open={isUpdateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            email: user.email,
            username: user.username,
            cccd: user.cccd,
            address: user.address,
            phone: user.phone_number,
            gender: user.gender,
            bloodType: user.bloodType,
          }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: "email", message: "Email không hợp lệ!" },
              { required: true, message: "Vui lòng nhập email!" },
            ]}
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>

          <Form.Item
            name="username"
            label="UserName"
            rules={[{ required: true, message: "Vui lòng nhập UserName!" }]}
          >
            <Input placeholder="Tên bạn muốn hiển thị" />
          </Form.Item>

          <Form.Item
            name="cccd"
            label="CCCD"
            rules={[
              { required: true, message: "Vui lòng nhập số CCCD!" },
              {
                pattern: /^[0-9]{12}$/,
                message: "CCCD phải gồm đúng 12 chữ số!",
              },
            ]}
          >
            <Input placeholder="012345678901" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Nơi cư trú"
            rules={[{ required: true, message: "Vui lòng nhập nơi cư trú!" }]}
          >
            <Input placeholder="Ví dụ: Quận 1, TP. Hồ Chí Minh" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^(0|\+84)[0-9]{9,10}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="0901234567" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="bloodType"
            label="Nhóm máu"
            rules={[{ required: true, message: "Vui lòng chọn nhóm máu!" }]}
          >
            <Select placeholder="Chọn nhóm máu">
              <Option value="A+">A+</Option>
              <Option value="A-">A-</Option>
              <Option value="B+">B+</Option>
              <Option value="B-">B-</Option>
              <Option value="AB+">AB+</Option>
              <Option value="AB-">AB-</Option>
              <Option value="O+">O+</Option>
              <Option value="O-">O-</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
