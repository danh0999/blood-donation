import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Table, Button, Form, Input, Select } from "antd";
import { login } from "../../redux/features/userSlice"; // Đảm bảo đúng đường dẫn
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import api from "../../configs/axios";

const { Option } = Select;

const Profile = () => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);

  const bloodTypeOptions = [
    { label: "A+", value: "A_POS" },
    { label: "A-", value: "A_NEG" },
    { label: "B+", value: "B_POS" },
    { label: "B-", value: "B_NEG" },
    { label: "AB+", value: "AB_POS" },
    { label: "AB-", value: "AB_NEG" },
    { label: "O+", value: "O_POS" },
    { label: "O-", value: "O_NEG" },
  ];

  const [form] = Form.useForm();

  if (!user) {
    return <p className={styles.notice}>Bạn chưa đăng nhập.</p>;
  }

  const handleUpdate = async (values) => {
    const payload = {
      ...user,
      ...values,
    };
    console.log("Payload gửi lên:", payload);

    try {
      const res = await api.put(`/users/${user.userID}`, payload);
      dispatch(login(res.data.data));
      toast.success("Cập nhật thành công!");
      setUpdateModalVisible(false);
    } catch (err) {
      console.error("Lỗi cập nhật:", err.response?.data || err.message);
      toast.error("Cập nhật thất bại!");
    }
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
        <strong>CCCD:</strong> {user.cccd}
      </p>
      <p>
        <strong>Address:</strong> {user.address}
      </p>
      <p>
        <strong>Số điện thoại:</strong> {user.phone}
      </p>
      <p>
        <strong>Gender:</strong> {user.gender}
      </p>
      <p>
        <strong>TypeBlood:</strong> {user.tyleBlood}
      </p>
      <p>
        <strong>Vai trò:</strong> {user.role}
      </p>

      <div className={styles.buttonGroup}>
        <Button
          type="dashed"
          onClick={() => {
            form.setFieldsValue({
              email: user.email || "",
              username: user.username || "",
              cccd: user.cccd || "",
              address: user.address || "",
              phone: user.phone || "",
              gender: user.gender || "",
              typeBlood: user.typeBlood || "",
            });
            setUpdateModalVisible(true);
          }}
        >
          Cập nhật thông tin
        </Button>
      </div>

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
            phone: user.phone,
            gender: user.gender,
            bloodType: user.typeBlood,
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
            name="typeBlood"
            label="Nhóm máu"
            rules={[{ required: true, message: "Vui lòng chọn nhóm máu!" }]}
          >
            <Select placeholder="Chọn nhóm máu">
              {bloodTypeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
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
