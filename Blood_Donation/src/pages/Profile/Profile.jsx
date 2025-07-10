import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { updateUser } from "../../redux/features/userSlice";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { Option } = Select;

  const bloodTypeOptions = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "AB", value: "AB" },
    { label: "O", value: "O" },
  ];

  if (!user) {
    return <p className={styles.notice}>Bạn chưa đăng nhập.</p>;
  }

  const handleUpdate = async (updatedData) => {
    try {
      const formattedData = {
        ...user,
        ...updatedData,
        birthdate: updatedData.birthdate?.format("YYYY-MM-DD"),
      };

      const response = await api.put(`/users/${user.userID}`, formattedData);
      console.log("Gửi lên server:", formattedData);

      toast.success("Cập nhật thành công!");
      dispatch(
        updateUser({
          ...user,
          ...response.data,
          token: user.token,
        })
      );
      setUpdateModalVisible(false);
    } catch (error) {
      console.error("Lỗi cập nhật:", error.response?.data || error.message);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.sectionWrapper}>
        {/* Thông tin cá nhân */}
        <div className={styles.profileSection}>
          <h3>🧍 Thông tin cá nhân</h3>
          <p>
            <strong>Họ tên :</strong> {user.fullName}
          </p>
          <p>
            <strong>CCCD :</strong> {user.cccd}
          </p>
          <p>
            <strong>Giới tính :</strong> {user.gender === "MALE" ? "Nam" : "Nữ"}
          </p>
          <p>
            <strong>Ngày sinh :</strong> {user.birthdate}
          </p>
          <p>
            <strong>Nhóm máu :</strong> {user.typeBlood}
          </p>
        </div>

        {/* Thông tin liên hệ */}
        <div className={styles.profileSection}>
          <h3>📞 Thông tin liên hệ</h3>
          <p>
            <strong>Email :</strong> {user.email}
          </p>
          <p>
            <strong>Địa chỉ :</strong> {user.address}
          </p>
          <p>
            <strong>SĐT :</strong> {user.phone}
          </p>

          <div className={styles.editButtonWrapper}>
            <Button
              type="link"
              onClick={() => {
                form.setFieldsValue({
                  fullName: user.fullName || "",
                  email: user.email || "",
                  username: user.username || "",
                  cccd: user.cccd || "",
                  address: user.address || "",
                  phone: user.phone || "",
                  gender: user.gender || "",
                  typeBlood: user.typeBlood || "",
                  birthdate: user.birthdate ? dayjs(user.birthdate) : null,
                });
                setUpdateModalVisible(true);
              }}
            >
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>

      {/* Modal cập nhật */}
      <Modal
        title="Cập nhật thông tin liên hệ"
        open={isUpdateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            cccd: user.cccd,
            address: user.address,
            phone: user.phone,
            gender: user.gender,
            typeBlood: user.typeBlood,
            birthdate: user.birthdate ? dayjs(user.birthdate) : null,
          }}
        >
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Tên bạn muốn hiển thị" />
          </Form.Item>

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
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập Username!" }]}
          >
            <Input placeholder="Tên đăng nhập" />
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
            name="birthdate"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
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
              <Option value="MALE">Nam</Option>
              <Option value="FEMALE">Nữ</Option>
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
