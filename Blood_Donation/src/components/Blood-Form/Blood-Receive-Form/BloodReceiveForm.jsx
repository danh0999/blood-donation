import React from "react";
import { Form, Input, Button, Select, DatePicker, TimePicker } from "antd";
import styles from "../Blood-Receive-Form/styles.module.scss";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function BloodReceiveForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Lấy user từ Redux
  const user = useSelector((state) => state.user);

  const handleSubmit = async () => {
    if (!user) {
      toast.warning("Bạn cần đăng nhập để gửi thông tin nhận máu.");
      navigate("/login");
      return;
    }

    try {
      //   const formatted = {
      //     ...values,
      //     receiveDate: values.receiveDate.format("YYYY-MM-DD"),
      //     receiveTime: values.receiveTime.format("HH:mm"),
      //   };

      // Gửi API nếu có
      // await dispatch(registerReceive(formatted)).unwrap();

      toast.success("Gửi yêu cầu nhận máu thành công!");
      form.resetFields();
    } catch (error) {
      toast.error(error?.message || "Đã xảy ra lỗi khi gửi yêu cầu.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Yêu Cầu Nhận Máu</h2>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        className={styles.form}
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="cccd"
          label="CCCD"
          rules={[
            { required: true, message: "Vui lòng nhập CCCD!" },
            {
              pattern: /^[0-9]{12}$/,
              message: "CCCD phải gồm đúng 12 chữ số!",
            },
          ]}
        >
          <Input placeholder="012345678901" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^(0|\+84)[0-9]{9,10}$/,
              message: "Số điện thoại không hợp lệ!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="example@gmail.com" />
        </Form.Item>

        <Form.Item
          label="Nhóm máu cần nhận"
          name="bloodType"
          rules={[{ required: true, message: "Vui lòng chọn nhóm máu!" }]}
        >
          <Select placeholder="Chọn nhóm máu cần">
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

        <Form.Item
          label="Lượng máu cần nhận (đơn vị: ml)"
          name="amount"
          rules={[{ required: true, message: "Vui lòng nhập lượng máu!" }]}
        >
          <Input type="number" min={100} step={50} placeholder="Ví dụ: 500" />
        </Form.Item>

        <Form.Item label="Lý do cần máu" name="reason">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Địa chỉ bệnh viện/nhà">
          <Form.Item
            name="hospital"
            rules={[
              { required: true, message: "Nhập địa chỉ nơi cần nhận máu!" },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="Tên bệnh viện hoặc địa chỉ cụ thể" />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label="Thời gian mong muốn nhận máu"
          required
          style={{ marginBottom: 0 }}
        >
          <Form.Item
            name="receiveDate"
            rules={[{ required: true, message: "Chọn ngày!" }]}
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <span
            style={{
              display: "inline-block",
              width: "16px",
              textAlign: "center",
            }}
          />
          <Form.Item
            name="receiveTime"
            rules={[{ required: true, message: "Chọn giờ!" }]}
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Gửi yêu cầu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default BloodReceiveForm;
