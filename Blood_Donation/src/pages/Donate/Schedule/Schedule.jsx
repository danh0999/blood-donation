import React, { useState, useRef, useEffect } from "react";
import { DatePicker, Select, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../../configs/axios";
import styles from "./styles.module.scss";
import { Button } from "../../../components/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProgram } from "../../../redux/features/bloodHistorySlice";

const { Option } = Select;

export const Schedule = () => {
  const { container, title, formWrapper, btn, programDetail } = styles;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProgram } = useSelector((state) => state.bloodHistory);

  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [slots, setSlots] = useState([]); // ✅
  const [selectedSlotId, setSelectedSlotId] = useState(null); // ✅
  const [loading, setLoading] = useState(false);
  const programSelectRef = useRef(null);

  const disabledDate = (current) => current && current < dayjs().startOf("day");

  useEffect(() => {
    if (selectedProgram) {
      form.setFieldsValue({
        date: dayjs(selectedProgram.startDate),
        cityId: selectedProgram.cityId,
      });

      const fetchSlotLabels = async () => {
        let slotLabels = [];
        let slotList = [];

        if (selectedProgram.slots && selectedProgram.slots.length > 0) {
          slotLabels = selectedProgram.slots.map((slot) => slot.label);
          slotList = selectedProgram.slots;
        } else if (selectedProgram.slotIds) {
          slotLabels = await Promise.all(
            selectedProgram.slotIds.map(async (slotId) => {
              try {
                const res = await api.get(`/slots/${slotId}`);
                return res.data.label;
              } catch {
                return "Không rõ";
              }
            })
          );
        }

        const programWithTime = {
          ...selectedProgram,
          timeRange: slotLabels.join(", ") || "Không rõ thời gian",
        };

        setPrograms([programWithTime]);
        setSelectedProgramId(programWithTime.id);
        setSlots(slotList); // ✅ Đặt slot để render dropdown
        // Không làm gì với Redux ở đây, chỉ xử lý local state
        setPrograms([programWithTime]);
        setSelectedProgramId(programWithTime.id);
      };

      fetchSlotLabels();
    }
  }, [selectedProgram]);

  const handleCheckSchedule = async () => {
    try {
      const values = await form.validateFields();
      const selectedDate = dayjs(values.date).format("YYYY-MM-DD");

      if (!values.cityId) {
        message.warning("Bạn chưa chọn địa điểm.");
        return;
      }

      setLoading(true);

      const res = await api.get("programs/search", {
        params: {
          date: selectedDate,
          cityId: values.cityId,
        },
      });

      if (!Array.isArray(res.data)) throw new Error("Kết quả không hợp lệ!");

      if (res.data.length === 0) {
        message.warning("Không có lịch hiến máu nào trong ngày này.");
        setPrograms([]);
        setSelectedProgramId(null);
      } else {
        const programsWithTime = await Promise.all(
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

    if (!selectedProgramId && !selectedProgram) {
      message.warning("Vui lòng chọn chương trình hiến máu.");
      return;
    }

    // Nếu có selectedProgram từ Redux (tức đi từ EventDetail), slotId phải lấy từ user chọn
    if (selectedProgram) {
      if (!selectedSlotId) {
        message.warning("Vui lòng chọn khung giờ.");
        return;
      }

      const updatedProgram = {
        ...selectedProgram,
        slotIds: [selectedSlotId], // Ghi đè lại slotId được chọn
      };

      dispatch(setSelectedProgram(updatedProgram));

      navigate("/user/donate/checkup", {
        state: {
          date: dayjs(values.date).format("YYYY-MM-DD"),
          cityId: values.cityId,
          programId: selectedProgram.id,
          slotId: selectedSlotId, // ✅ slot đã chọn
        },
      });
      return;
    }

    // Nếu chọn từ danh sách chương trình
    const program = programs.find((p) => p.id === selectedProgramId);
    if (!program) {
      message.error("Không tìm thấy chương trình đã chọn.");
      return;
    }

    if (!selectedSlotId) {
      message.warning("Vui lòng chọn khung giờ.");
      return;
    }

    const updatedProgram = {
      ...program,
      slotIds: [selectedSlotId],
    };

    dispatch(setSelectedProgram(updatedProgram));

    navigate("/user/donate/checkup", {
      state: {
        date: dayjs(values.date).format("YYYY-MM-DD"),
        cityId: values.cityId,
        programId: selectedProgramId,
        slotId: selectedSlotId,
      },
    });
  };

  const handleProgramChange = async (value) => {
    setSelectedProgramId(value);
    setSelectedSlotId(null);
    try {
      const res = await api.get("/slots", {
        params: { programId: value },
      });
      setSlots(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy slot:", err);
      setSlots([]);
    }
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
            name="cityId"
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
              onChange={handleProgramChange}
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
                    {program.proName}
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

            {slots.length > 0 && (
              <Form layout="vertical">
                <Form.Item
                  label="Chọn khung giờ hiến máu"
                  required
                  validateStatus={!selectedSlotId ? "error" : ""}
                  help={!selectedSlotId ? "Vui lòng chọn khung giờ." : ""}
                >
                  <Select
                    placeholder="Chọn khung giờ"
                    onChange={(value) => setSelectedSlotId(value)}
                    value={selectedSlotId || undefined}
                  >
                    {slots
                      .filter((slot) => slot?.slotID != null && slot?.label)
                      .map((slot) => (
                        <Option key={slot.slotID} value={slot.slotID}>
                          {slot.label}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Form>
            )}
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
