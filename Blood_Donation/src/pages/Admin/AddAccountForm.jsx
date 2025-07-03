import React from "react";
import { Form, Input, Select, Switch, DatePicker, Button } from "antd";

const bloodTypes = ["A", "B", "AB", "O"];

const AddAccountForm = ({
  roles = [],
  showPersonal,
  setShowPersonal,
  onCancel,
  onFinish,
  initialRole
}) => (
  <Form
    layout="vertical"
    onFinish={onFinish}
    initialValues={{
      role: initialRole || roles[0] || "",
    }}
  >
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: "Vui lòng nhập username!" }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: "Vui lòng nhập password!" }]}
    >
      <Input.Password />
    </Form.Item>
    <Form.Item
      label="Role"
      name="role"
      rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
    >
      <Select>
        {roles.map((role) => (
          <Select.Option key={role} value={role}>
            {role}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item label="Nhập thông tin cá nhân" style={{ marginBottom: 0 }}>
      <Switch checked={showPersonal} onChange={setShowPersonal} />
    </Form.Item>
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
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
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
      <Button onClick={onCancel} style={{ marginRight: 8 }}>
        Hủy
      </Button>
      <Button type="primary" htmlType="submit">
        Thêm
      </Button>
    </Form.Item>
  </Form>
);

export default AddAccountForm;
