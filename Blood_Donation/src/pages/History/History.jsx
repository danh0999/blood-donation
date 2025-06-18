import React from "react";
import styles from "./styles.module.scss";
import { Button } from "../../components/Button/Button";
import calendarImg from "../../assets/calendar.png"; // dùng ảnh SVG sẽ đẹp hơn nếu có

export const History = () => {
  const { container, image, title, message } = styles;

  return (
    <div className={container}>
      <img src={calendarImg} alt="Calendar" className={image} />
      <h1 className={title}>Lịch sử đặt hẹn hiến máu</h1>
      <p className={message}>Hiện tại bạn chưa có lịch hẹn nào.</p>
      <Button content="Đặt lịch ngay" to="/schedule" />
    </div>
  );
};
