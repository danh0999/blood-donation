import React, { useState, useEffect } from "react";
import { DatePicker, Select, Form, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../../configs/axios";
import styles from "./styles.module.scss";
import { Button } from "../../../components/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProgram } from "../../../redux/features/bloodHistorySlice";
import { toast } from "react-toastify";

const { Option } = Select;

export const Schedule = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { selectedProgram } = useSelector((state) => state.bloodHistory);
  const user = useSelector((state) => state.user);

  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameFromEventDetail = !!location.state?.fromEventDetail;

  const disabledDate = (current) => current && current < dayjs().startOf("day");

  useEffect(() => {
    form.resetFields();
    setPrograms([]);
    setSelectedProgramId(null);
    setSlots([]);
    setSelectedSlotId(null);

    if (!cameFromEventDetail) {
      dispatch(setSelectedProgram(null));
    }

    if (selectedProgram && cameFromEventDetail) {
      form.setFieldsValue({
        date: dayjs(selectedProgram.startDate),
        cityId: selectedProgram.cityId,
      });

      const fetchSlotLabels = async () => {
        const slotLabels = await Promise.all(
          selectedProgram.slotIds.map(async (slotId) => {
            try {
              const res = await api.get(`/slots/${slotId}`);
              return res.data.label;
            } catch {
              return "Không rõ";
            }
          })
        );

        const programWithTime = {
          ...selectedProgram,
          timeRange: slotLabels.join(", ") || "Không rõ thời gian",
        };

        setPrograms([programWithTime]);
        setSelectedProgramId(programWithTime.id);
        setSlots(selectedProgram.slots || []);
      };

      fetchSlotLabels();
    }
  }, [selectedProgram, cameFromEventDetail]);

  const handleCheckSchedule = async () => {
    try {
      const values = await form.validateFields();
      const selectedDate = dayjs(values.date).format("YYYY-MM-DD");

      setLoading(true);
      const res = await api.get("programs/search", {
        params: {
          date: selectedDate,
          cityId: values.cityId,
        },
      });

      if (!Array.isArray(res.data)) throw new Error("Kết quả không hợp lệ!");

      if (res.data.length === 0) {
        message.warning("Không có chương trình hiến máu nào trong ngày này.");
        setPrograms([]);
        setSelectedProgramId(null);
      } else {
        const enrichedPrograms = await Promise.all(
          res.data.map(async (program) => {
            const slotLabels = await Promise.all(
              (program.slotIds || []).map(async (slotId) => {
                try {
                  const slotRes = await api.get(`/slots/${slotId}`);
                  return slotRes.data.label;
                } catch {
                  return "Không rõ";
                }
              })
            );

            let addressName = "Không rõ";
            try {
              const addressRes = await api.get(
                `/addresses/${program.addressId}`
              );
              addressName = addressRes.data.name || "Không rõ"; // ✅ Sửa tại đây
            } catch (err) {
              console.warn("Không lấy được địa chỉ:", err);
            }

            return {
              ...program,
              addressName,
              timeRange: slotLabels.join(", "),
            };
          })
        );

        setPrograms(enrichedPrograms);
        message.success("Tìm thấy chương trình phù hợp.");
      }
    } catch (err) {
      console.error("Lỗi:", err);
      message.error("Lỗi khi tìm kiếm chương trình.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProgram = async (program) => {
    setSelectedProgramId(program.id);
    setSelectedSlotId(null);
    try {
      const res = await api.get("/slots", {
        params: { programId: program.id },
      });
      setSlots(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy slot:", err);
      setSlots([]);
    }
  };

  const handleContinue = async () => {
    const values = await form.getFieldsValue();

    if (!selectedProgramId) {
      return message.warning("Vui lòng chọn chương trình hiến máu.");
    }

    if (!selectedSlotId) {
      return message.warning("Vui lòng chọn khung giờ.");
    }

    const requiredFields = [
      "fullName",
      "typeBlood",
      "phone",
      "cccd",
      "birthdate",
      "gender",
    ];
    const missingFields = requiredFields.filter((field) => !user?.[field]);

    if (missingFields.length > 0) {
      toast.error(
        "⚠️ Vui lòng cập nhật đầy đủ thông tin cá nhân trước khi đặt lịch."
      );
      navigate("/user/profile");
      return;
    }
    const program = programs.find((p) => p.id === selectedProgramId);
    if (!program) return message.error("Không tìm thấy chương trình.");

    const updatedProgram = {
      ...program,
      slotIds: [selectedSlotId],
    };

    dispatch(setSelectedProgram(updatedProgram));

    navigate("/user/donate/checkup", {
      state: {
        date: dayjs(values.date).format("YYYY-MM-DD"),
        cityId: values.cityId,
        programId: program.id,
        slotId: selectedSlotId,
      },
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Đặt lịch hiến máu</h2>

      <div className={styles.layoutWrapper}>
        {/* Form bên trái */}
        <div className={styles.formSection}>
          <Form form={form} layout="vertical">
            <Form.Item
              label="Chọn ngày hiến máu"
              name="date"
              rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                disabledDate={disabledDate}
              />
            </Form.Item>

            <Form.Item
              label="Tỉnh/Thành phố"
              name="cityId"
              rules={[{ required: true, message: "Vui lòng chọn địa điểm" }]}
            >
              <Select placeholder="Chọn tỉnh/thành phố">
                <Option value={1}>Hồ Chí Minh</Option>
                <Option value={2}>Đà Nẵng</Option>
                <Option value={3}>Hà Nội</Option>
              </Select>
            </Form.Item>

            <div className={styles.btn}>
              <Button content="Kiểm tra lịch" onClick={handleCheckSchedule} />
              <Button content="Tiếp tục" onClick={handleContinue} />
            </div>
          </Form>
        </div>

        {/* Danh sách chương trình bên phải */}
        {programs.length > 0 && (
          <div className={styles.programListSection}>
            <h3>Danh sách chương trình phù hợp</h3>
            {programs.map((program) => (
              <div
                key={program.id}
                className={styles.programDetail}
                style={{
                  border: "1px solid #ccc",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  backgroundColor:
                    selectedProgramId === program.id ? "#e6f7ff" : "#fff",
                }}
              >
                <p>
                  <strong>Tên:</strong> {program.proName}
                </p>
                {program.imageUrl && (
                  <img
                    src={program.imageUrl}
                    alt="Hình ảnh chương trình"
                    style={{
                      width: 100,
                      height: "auto",
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  />
                )}

                <p>
                  <strong>Địa điểm:</strong> {program.addressName || "Không rõ"}
                </p>
                <p>
                  <strong>Thời gian:</strong> {program.timeRange}
                </p>
                <p>
                  <strong>Ghi chú:</strong> {program.description || "Không có"}
                </p>

                <Button
                  content="Chọn chương trình này"
                  onClick={() => handleSelectProgram(program)}
                />

                {selectedProgramId === program.id && slots.length > 0 && (
                  <Form layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                      label="Chọn khung giờ"
                      required
                      validateStatus={!selectedSlotId ? "error" : ""}
                      help={!selectedSlotId ? "Vui lòng chọn khung giờ." : ""}
                    >
                      <Select
                        placeholder="Chọn khung giờ"
                        onChange={(value) => setSelectedSlotId(value)}
                        value={selectedSlotId || undefined}
                      >
                        {slots.map((slot) => (
                          <Option key={slot.slotID} value={slot.slotID}>
                            {slot.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
