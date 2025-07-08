import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Checkbox, Input, Button, message, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  setDonationHistory,
  setCurrentAppointment,
} from "../../../redux/features/bloodHistorySlice";
import api from "../../../configs/axios";

const questions = [
  "1. Anh/chị từng hiến máu chưa?",
  "2. Hiện tại, anh/ chị có mắc bệnh lý nào không?",
  "3. Trước đây, anh/chị có từng mắc một trong các bệnh...?",
  "4. Trong 12 tháng gần đây, anh/chị có:",
  "5. Trong 06 tháng gần đây, anh/chị có:",
  "6. Trong 01 tháng gần đây, anh/chị có:",
  "7. Trong 14 ngày gần đây, anh/chị có:",
  "8. Trong 07 ngày gần đây, anh/chị có:",
  "9. Câu hỏi dành cho phụ nữ:",
];

const DonateCheckup = () => {
  const [answers, setAnswers] = useState(
    Array(questions.length).fill({ answer: null, note: "" })
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);

  // ✅ Lấy đầy đủ thông tin truyền qua
  const { programId, date, locationId, slotId } = location.state || {};

  const handleCheckboxChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index].answer = value;
    setAnswers(newAnswers);
  };

  const handleNoteChange = (index, e) => {
    const newAnswers = [...answers];
    newAnswers[index].note = e.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!programId || !user?.userID || !slotId) {
      message.error("Thiếu thông tin người dùng, chương trình hoặc khung giờ.");
      return;
    }

    try {
      const res = await api.post(
        "/appointments",
        {
          slotId, // ✅ Sử dụng đúng slot người dùng đã chọn
          programId,
          date,
        },
        {
          params: {
            userId: user.userID,
          },
        }
      );

      const appointment = res.data;
      const detailRes = await api.get(`/appointments/${appointment.id}`);
      const detail = detailRes.data;

      dispatch(
        setDonationHistory([
          {
            id: detail.id,
            address: detail.address || "Không rõ địa điểm",
            time: detail.timeRange || "Không rõ thời gian",
          },
        ])
      );

      dispatch(
        setCurrentAppointment({
          id: detail.id,
          address: detail.address || "Không rõ địa điểm",
          time: detail.timeRange || "Không rõ thời gian",
        })
      );

      message.success("Đăng ký hiến máu thành công!");
      navigate("/user/bloodDonate");
    } catch (error) {
      console.error("Lỗi gửi appointment:", error);

      if (
        error.response?.data?.message?.includes(
          "already have an appointment"
        ) ||
        error.response?.data?.error?.includes("already have")
      ) {
        Modal.error({
          title: "Bạn chỉ có thể đăng ký 1 đơn hiến máu tại 1 thời điểm",
          content: "Rất tiếc, bạn vừa hiến máu gần đây",
          okText: "Xác nhận",
          centered: true,
        });

        try {
          const res = await api.get(`/appointments/by-user`, {
            params: { userId: user.userID },
          });

          const appointment = res.data.find((a) => a.status === "PENDING");

          if (appointment) {
            const detailRes = await api.get(`/appointments/${appointment.id}`);
            const detail = detailRes.data;

            dispatch(
              setDonationHistory([
                {
                  id: detail.id,
                  address: detail.address || "Không rõ địa điểm",
                  time: detail.timeRange || "Không rõ thời gian",
                },
              ])
            );

            dispatch(
              setCurrentAppointment({
                id: detail.id,
                address: detail.address || "Không rõ địa điểm",
                time: detail.timeRange || "Không rõ thời gian",
              })
            );

            navigate("/user/bloodDonate");
          }
        } catch (err) {
          console.error("Không thể lấy lại lịch hẹn:", err);
          message.error("Không thể lấy lại lịch hẹn.");
        }
      } else {
        message.error("Lỗi khi đăng ký lịch hiến máu.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Khảo sát trước hiến máu</h2>
      <form className={styles.form}>
        {questions.map((question, index) => (
          <div key={index} className={styles.questionItem}>
            <p className={styles.questionText}>{question}</p>
            <Checkbox.Group
              className={styles.checkboxGroup}
              value={[answers[index].answer]}
              onChange={(vals) => handleCheckboxChange(index, vals[0])}
            >
              <Checkbox value="yes">Có</Checkbox>
              <Checkbox value="no">Không</Checkbox>
            </Checkbox.Group>
            <Input.TextArea
              rows={2}
              placeholder="Ghi chú (nếu có)"
              value={answers[index].note}
              onChange={(e) => handleNoteChange(index, e)}
            />
          </div>
        ))}

        <Button type="primary" onClick={handleSubmit} style={{ marginTop: 24 }}>
          Gửi phiếu khảo sát
        </Button>
      </form>
    </div>
  );
};

export default DonateCheckup;
