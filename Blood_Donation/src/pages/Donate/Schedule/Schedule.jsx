// src/pages/Donate/Schedule/Schedule.jsx
import React, { useState, useRef } from "react";
import { DatePicker, Select, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../../configs/axios";
import styles from "./styles.module.scss";
import { Button } from "../../../components/Button/Button";

const { Option } = Select;

export const Schedule = () => {
  const { container, title, formWrapper, btn, programDetail } = styles;
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [loading, setLoading] = useState(false);

  const programSelectRef = useRef(null);

  const disabledDate = (current) => current && current < dayjs().startOf("day");

  const handleCheckSchedule = async () => {
    try {
      const values = await form.validateFields();
      const selectedDate = dayjs(values.date).format("YYYY-MM-DD");

      if (!values.locationId) {
        message.warning("Bạn chưa chọn địa điểm.");
        return;
      }

      setLoading(true);

      const res = await api.get("programs/search", {
        params: {
          date: selectedDate,
          locationId: values.locationId,
        },
      });

      if (!Array.isArray(res.data)) throw new Error("Kết quả không hợp lệ!");

      if (res.data.length === 0) {
        message.warning("Không có lịch hiến máu nào trong ngày này.");
        setPrograms([]);
        setSelectedProgramId(null);
      } else {
        // Lấy thông tin slot label từ slotIds
        const programsWithTime = await Promise.all(
          res.data.map(async (program) => {
            const slotLabels = await Promise.all(
              (program.slotIds || []).map(async (slotId) => {
                try {
                  const slotRes = await api.get(`/slots/${slotId}`);
                  return slotRes.data.label;
                } catch (e) {
                  console.log(e);

                  return "Không rõ";
                }
              })
            );

            return {
              ...program,
              timeRange: slotLabels.join(", ") || "Không rõ thời gian",
            };
          })
        );

        setPrograms(programsWithTime);
        setSelectedProgramId(null);
        message.success("Đã tìm thấy các chương trình hiến máu.");

        setTimeout(() => {
          if (programSelectRef.current) programSelectRef.current.focus();
        }, 200);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Lỗi khi kiểm tra lịch. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    const values = await form.getFieldsValue();
    if (!selectedProgramId) {
      message.warning("Vui lòng chọn chương trình hiến máu.");
      return;
    }

    navigate("/user/donate/checkup", {
      state: {
        date: dayjs(values.date).format("YYYY-MM-DD"),
        locationId: values.locationId,
        programId: selectedProgramId,
      },
    });
  };

  return (
    <div className={container}>
      <h2 className={title}>Đặt lịch hiến máu</h2>

      <div className={formWrapper}>
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Chọn ngày hiến máu"
            name="date"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              style={{ width: "100%" }}
              onChange={() => {
                setPrograms([]);
                setSelectedProgramId(null);
              }}
            />
          </Form.Item>

          <Form.Item
            label="Tỉnh/Thành phố"
            name="locationId"
            rules={[{ required: true, message: "Vui lòng chọn địa điểm" }]}
          >
            <Select
              placeholder="Chọn tỉnh/thành phố"
              onChange={() => {
                form.setFieldsValue({ date: null });
                setPrograms([]);
                setSelectedProgramId(null);
              }}
            >
              <Option value={1}>Hồ Chí Minh</Option>
              <Option value={2}>Đà Nẵng</Option>
              <Option value={3}>Hà Nội</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Chọn chương trình hiến máu">
            <Select
              ref={programSelectRef}
              placeholder="Chọn chương trình"
              onChange={(value) => setSelectedProgramId(value)}
              disabled={programs.length === 0}
              loading={loading}
              value={selectedProgramId || undefined}
              className={styles.programSelect}
            >
              {programs.length === 0 ? (
                <Option value="" disabled>
                  Không có lịch hiến máu
                </Option>
              ) : (
                programs.map((program) => (
                  <Option key={program.id} value={program.id}>
                    {`${program.proName}`}
                  </Option>
                ))
              )}
            </Select>
          </Form.Item>
        </Form>

        {selectedProgramId && (
          <div className={programDetail}>
            <h3>Thông tin chương trình đã chọn</h3>
            {programs
              .filter((p) => p.id === selectedProgramId)
              .map((p) => (
                <div key={p.id}>
                  <p>
                    <strong>Tên:</strong> {p.proName}
                  </p>
                  <p>
                    <strong>Địa điểm:</strong> {p.address}
                  </p>
                  <p>
                    <strong>Thời gian:</strong> {p.timeRange}
                  </p>
                  <p>
                    <strong>Ghi chú:</strong> {p.description || "Không có"}
                  </p>
                </div>
              ))}
          </div>
        )}

        <div className={btn}>
          <Button content="Kiểm tra lịch" onClick={handleCheckSchedule} />
          <Button content="Tiếp tục" onClick={handleContinue} />
        </div>
      </div>
    </div>
  );
};
