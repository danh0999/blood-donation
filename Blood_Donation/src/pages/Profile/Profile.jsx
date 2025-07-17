import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import api from "../../configs/axios";
import { updateUser } from "../../redux/features/userSlice";
import EnhancedPlacesAutocomplete from "../../pages/Admin/Programs/EnhancedPlacesAutocomplete";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { Option } = Select;
  // eslint-disable-next-line no-unused-vars
  const [selectedLatLng, setSelectedLatLng] = useState({
    lat: user.latitude || user.address?.latitude || null,
    lng: user.longitude || user.address?.longitude || null,
  });

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
      // Parse tọa độ về kiểu số hoặc null
      const lat = updatedData.latitude
        ? parseFloat(updatedData.latitude)
        : null;
      const lng = updatedData.longitude
        ? parseFloat(updatedData.longitude)
        : null;

      const formattedData = {
        ...user,
        ...updatedData,
        birthdate: updatedData.birthdate?.format("YYYY-MM-DD"),
      };

      // Gán địa chỉ chỉ khi có đủ dữ liệu
      if (updatedData.address && lat !== null && lng !== null) {
        formattedData.address = {
          name: updatedData.address,
          latitude: lat,
          longitude: lng,
        };
      } else {
        formattedData.address = null;
      }

      // Không gửi riêng lẻ latitude/longitude nếu chúng đã nằm trong address
      delete formattedData.latitude;
      delete formattedData.longitude;

      const response = await api.put(`/users/${user.userID}`, formattedData);
      toast.success("Cập nhật thành công!");
      dispatch(updateUser({ ...user, ...response.data, token: user.token }));
      setUpdateModalVisible(false);
    } catch (error) {
      console.error("Lỗi cập nhật:", error.response?.data || error.message);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.editButtonWrapper}>
        <Button
          type="link"
          onClick={() => {
            form.setFieldsValue({
              fullName: user.fullName || "",
              email: user.email || "",
              username: user.username || "",
              cccd: user.cccd || "",
              address: user.address?.name || "",
              latitude: user.address?.latitude || user.latitude || null,
              longitude: user.address?.longitude || user.longitude || null,
              phone: user.phone || "",
              gender: user.gender || "",
              typeBlood: user.typeBlood || "",
              birthdate: user.birthdate ? dayjs(user.birthdate) : null,
            });

            setSelectedLatLng({
              lat: user.address?.latitude || user.latitude || null,
              lng: user.address?.longitude || user.longitude || null,
            });

            setUpdateModalVisible(true);
          }}
        >
          Chỉnh sửa
        </Button>
      </div>

      <div className={styles.sectionWrapper}>
        <div className={styles.profileSection}>
          <h3>🧍 Thông tin cá nhân</h3>
          <p>
            <strong>Họ tên :</strong> {user.fullName || "-"}
          </p>
          <p>
            <strong>CCCD :</strong> {user.cccd || "-"}
          </p>
          <p>
            <strong>Giới tính :</strong> {user.gender || "-"}
          </p>
          <p>
            <strong>Ngày sinh :</strong> {user.birthdate || "-"}
          </p>
          <p>
            <strong>Nhóm máu :</strong> {user.typeBlood || "-"}
          </p>
        </div>

        <div className={styles.profileSection}>
          <h3>📞 Thông tin liên hệ</h3>
          <p>
            <strong>Email :</strong> {user.email || "-"}
          </p>
          <p>
            <strong>Địa chỉ :</strong> {user.address?.name || "-"}
          </p>
          <p>
            <strong>SĐT :</strong> {user.phone || "-"}
          </p>
        </div>
      </div>

      <Modal
        title="Cập nhật thông tin liên hệ"
        open={isUpdateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
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
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <EnhancedPlacesAutocomplete
              value={form.getFieldValue("address")}
              onChange={(val) => form.setFieldsValue({ address: val })}
              onPlaceSelect={(place) => {
                const lat = place.coordinates?.lat ?? null;
                const lng = place.coordinates?.lng ?? null;
                form.setFieldsValue({
                  address: place.formattedAddress,
                  latitude: lat,
                  longitude: lng,
                });
                setSelectedLatLng({ lat, lng });
              }}
            />
          </Form.Item>

          <Form.Item name="latitude" hidden>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="longitude" hidden>
            <Input type="number" />
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
            rules={[{ required: false }]}
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
