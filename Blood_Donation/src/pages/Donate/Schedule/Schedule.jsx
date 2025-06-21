// src/pages/Donate/Schedule/Schedule.jsx
import React from "react";
import { DatePicker, Select, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./styles.module.scss";
import { Button } from "../../../components/Button/Button";

const { Option } = Select;

export const Schedule = () => {
  const { container, title, formWrapper } = styles;
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const handleContinue = async () => {
    try {
      const values = await form.validateFields();

      const selectedDate = dayjs(values.date);
      if (selectedDate.isBefore(dayjs(), "day")) {
        message.error("Không thể chọn ngày trong quá khứ.");
        return;
      }

      console.log("Form values:", {
        ...values,
        date: selectedDate.format("DD/MM/YYYY"),
      });

      message.success("Lưu thông tin thành công!");
      navigate("/user/donate/checkup");
    } catch (error) {
      if (error?.errorFields?.length > 0) {
        const firstError = error.errorFields[0];
        const { name, errors } = firstError;

        if (errors.length > 0) {
          message.warning(errors[0]);
        }

        form.scrollToField(name[0]);
      } else {
        message.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className={container}>
      <h2 className={title}>Đặt lịch hiến máu</h2>

      <div className={formWrapper}>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ location: "Hồ Chí Minh" }}
        >
          <Form.Item
            label="Chọn ngày hiến máu"
            name="date"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Tỉnh/Thành phố"
            name="location"
            rules={[{ required: true, message: "Vui lòng chọn địa điểm" }]}
          >
            <Select>
              <Option value="Hồ Chí Minh">Hồ Chí Minh</Option>
              <Option value="Hà Nội">Hà Nội</Option>
              <Option value="Đà Nẵng">Đà Nẵng</Option>
            </Select>
          </Form.Item>
        </Form>

        <Button content="Tiếp tục" onClick={handleContinue} />
      </div>
    </div>
  );
};
