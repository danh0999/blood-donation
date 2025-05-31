import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, Typography } from "antd";

const { Title } = Typography;
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 32,
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Đăng nhập
      </Title>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="">Forgot password</a>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Đăng nhập
          </Button>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            or <Link to="/register">Đăng kí ngay!</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
