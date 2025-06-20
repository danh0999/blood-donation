import React from "react";
import styles from "./styles.module.scss";
import { Checkbox, Input } from "antd";

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
  return (
    <div className={styles.container}>
      <h2>Phiếu khảo sát trước hiến máu</h2>
      <form className={styles.form}>
        {questions.map((question, index) => (
          <div key={index} className={styles.questionItem}>
            <p className={styles.questionText}>{question}</p>
            <Checkbox.Group className={styles.checkboxGroup}>
              <Checkbox value="yes">Có</Checkbox>
              <Checkbox value="no">Không</Checkbox>
              <Input.TextArea rows={2} placeholder="Ghi chú (nếu có)" />
            </Checkbox.Group>
          </div>
        ))}
      </form>
    </div>
  );
};

export default DonateCheckup;
