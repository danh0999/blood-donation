import React, { useEffect } from "react";
import { Form, Input, Select, DatePicker, Button } from "antd";
import dayjs from "dayjs";

const bloodTypes = ["A", "B", "AB", "O"];
const roleOptions = ["ADMIN", "STAFF", "HOSPITAL_STAFF"];

const UpdateAccountForm = ({
  initialValues = {},
  onCancel,
  onFinish,
  showPersonal = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        birthdate: initialValues.birthdate ? dayjs(initialValues.birthdate) : undefined,
      });
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      {/* Only show role if NOT showPersonal (account info update) */}
      {!showPersonal && (
        <>
          <Form.Item 
            label="Username" 
            name="username"
            rules={[{ required: true}]}
            tooltip="Không thể thay đổi username vì đây là định danh duy nhất của tài khoản."
          >
            <Input disabled />
          </Form.Item>
          <Form.Item 
          label="Password" 
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới"}]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select>
              {roleOptions.map((role) => (
                <Select.Option key={role} value={role}>{role}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
      )}
      {/* Only show personal info fields if showPersonal is true */}
      {showPersonal && (
        <>
          <Form.Item label="Họ và Tên" name="fullName">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="CCCD" name="cccd">
            <Input />
          </Form.Item>
          <Form.Item label="Nhóm máu" name="typeBlood">
            <Select placeholder="Chọn nhóm máu">
              {bloodTypes.map((type) => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Giới tính" name="gender">
            <Input />
          </Form.Item>
          <Form.Item label="Ngày sinh" name="birthdate">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
        </>
      )}
      <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>Hủy</Button>
        <Button type="primary" htmlType="submit">Cập nhật</Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateAccountForm;
