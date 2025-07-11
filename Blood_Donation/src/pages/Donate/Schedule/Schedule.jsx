import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  DatePicker,
  Select,
  Form,
  Input,
  Button as AntButton,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { setCurrentAppointment } from "../../../redux/features/bloodHistorySlice";
import api from "../../../configs/axios";
import dayjs from "dayjs";

const { Option } = Select;

const Schedule = () => {
  const location = useLocation();
  const { fromEventDetail, selectedDate } = location.state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedProgram = useSelector((state) => state.blood.selectedProgram);
  const user = useSelector((state) => state.user);

  const [form] = Form.useForm();
  const [slots, setSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy toàn bộ slot của chương trình
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedProgram?.id) return;
      try {
        const res = await api.get("/slots", {
          params: { programId: selectedProgram.id },
        });
        setSlots(res.data || []);
      } catch (err) {
        console.error("Lỗi khi tải slot:", err);
        message.error("Không thể tải khung giờ hiến máu.");
      }
    };
    fetchSlots();
  }, [selectedProgram?.id]);

  // Nếu từ EventDetail chuyển qua và có selectedDate thì set ngày và fill slot
  useEffect(() => {
    if (fromEventDetail && selectedDate) {
      const dateObj = dayjs(selectedDate);
      form.setFieldsValue({ date: dateObj });
      handleDateChange(dateObj);
    }
  }, [fromEventDetail, selectedDate, form]);

  // Khi chọn ngày, lọc slot phù hợp theo ngày đó
  const handleDateChange = (date) => {
    if (!date || !slots.length) return;
    const formatted = dayjs(date).format("YYYY-MM-DD");
    const filtered = slots.filter((s) => s.date === formatted);
    setAvailableSlots(filtered);
    form.setFieldsValue({ slotId: undefined }); // reset khung giờ nếu đổi ngày
  };

  // Submit form đặt lịch
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        date: dayjs(values.date).format("YYYY-MM-DD"),
        programId: selectedProgram.id,
        userId: user.userID,
      };
      const res = await api.post("/appointments", payload);
      dispatch(setCurrentAppointment(res.data));
      message.success("Đăng ký hiến máu thành công!");
      navigate("/user/donate");
    } catch (error) {
      console.error("Lỗi đăng ký:", error.response?.data || error.message);
      message.error(error.response?.data || "Không thể đăng ký hiến máu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.scheduleWrapper}>
      <h2>Đăng ký lịch hiến máu</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
      >
        <Form.Item
          name="date"
          label="Chọn ngày hiến máu"
          rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            onChange={handleDateChange}
            disabledDate={(current) => {
              const start = dayjs(selectedProgram?.startDate);
              const end = dayjs(selectedProgram?.endDate);
              return current && (current < start || current > end);
            }}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="slotId"
          label="Chọn khung giờ hiến máu"
          rules={[{ required: true, message: "Vui lòng chọn khung giờ!" }]}
        >
          <Select
            placeholder="Chọn khung giờ"
            disabled={!availableSlots.length}
          >
            {availableSlots.map((slot) => (
              <Option key={slot.slotID} value={slot.slotID}>
                {slot.start} - {slot.end}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Ví dụ thêm 1 câu hỏi sàng lọc */}
        <Form.Item
          name="answer1"
          label="Bạn có bị bệnh trong 1 tuần qua không?"
          rules={[{ required: true, message: "Vui lòng trả lời!" }]}
        >
          <Input placeholder="Có / Không" />
        </Form.Item>

        <Form.Item>
          <AntButton type="primary" htmlType="submit" loading={loading} block>
            Xác nhận đăng ký
          </AntButton>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Schedule;
