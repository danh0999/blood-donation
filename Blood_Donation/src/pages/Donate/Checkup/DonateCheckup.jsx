import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Checkbox, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setDonationHistory } from "../../../redux/features/BloodHistorySlice";
import api from "../../../configs/axios";

const questions = [
  "1. Anh/chị từng hiến máu chưa?",
  "2. Hiện tại, anh/ chị có mắc bệnh lý nào không?",
  "3. Trước đây, anh/chị có từng mắc một trong các bệnh: viêm gan siêu vi B, C, HIV, vảy nến, phì đại tiền liệt tuyến, sốc phản vệ, tai biến mạch máu não, nhồi máu cơ tim, lupus ban đỏ, động kinh, ung thư, hen, được cấy ghép mô tạng?",
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

  const { programId, date, location: province } = location.state || {};

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
    if (!programId || !user?.id) {
      message.error("Thiếu thông tin người dùng hoặc chương trình.");
      return;
    }

    try {
      // Lấy slotId đầu tiên (nếu bạn chưa có UI chọn slot, có thể gán cứng để test)
      const selectedSlotId = 1; // TODO: thay bằng slotId thực tế được chọn

      const res = await api.post(
        "/appointments",
        {},
        {
          params: {
            userId: user.id,
            slotId: selectedSlotId,
            date,
            programId,
          },
        }
      );

      const appointment = res.data;

      dispatch(
        setDonationHistory([
          {
            id: appointment.id,
            address: appointment.address,
            time: appointment.timeRange,
          },
        ])
      );

      message.success("Đăng ký hiến máu thành công!");
      navigate("/user/donate");
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi đăng ký lịch hiến máu.");
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
              onChange={(checkedValues) =>
                handleCheckboxChange(index, checkedValues[0])
              }
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
