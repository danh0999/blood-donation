import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Button as CustomButton } from "../../components/Button/Button";
import calendarImg from "../../assets/calendar.png";
import api from "../../configs/axios";
import { useSelector } from "react-redux";
import { Spin, Empty, Tag } from "antd";

export const History = () => {
  const { container, image, title, message, historyList, card, infoRow } =
    styles;
  const user = useSelector((state) => state.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusColor = {
    PENDING: "orange",
    APPROVED: "green",
    FULFILLED: "blue",
    CANCELLED: "red",
    REJECTED: "volcano",
  };

  const statusLabel = {
    PENDING: "Đang chờ",
    APPROVED: "Đã duyệt",
    FULFILLED: "Đã hiến",
    CANCELLED: "Đã hủy",
    REJECTED: "Bị từ chối",
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get("/appointments/history", {
          params: { userId: user.userID },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Lỗi lấy lịch sử:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user.userID) {
      fetchHistory();
    }
  }, [user.userID]);

  return (
    <div className={container}>
      <h1 className={title}>Lịch sử đặt hẹn hiến máu</h1>

      {loading ? (
        <Spin />
      ) : appointments.length === 0 ? (
        <>
          <img src={calendarImg} alt="Calendar" className={image} />
          <p className={message}>Hiện tại bạn chưa có lịch hẹn nào.</p>
          <CustomButton content="Đặt lịch ngay" to="/user/donate" />
        </>
      ) : (
        <div className={historyList}>
          {appointments.map((item) => (
            <div className={card} key={item.id}>
              <div className={infoRow}>
                <strong>Ngày hẹn:</strong> {item.date}
              </div>
              <div className={infoRow}>
                <strong>Địa điểm:</strong> {item.address}
              </div>
              <div className={infoRow}>
                <strong>Thời gian:</strong> {item.timeRange}
              </div>
              <div className={infoRow}>
                <strong>Trạng thái:</strong>{" "}
                <Tag color={statusColor[item.status]}>
                  {statusLabel[item.status]}
                </Tag>
              </div>

              {/* 🎯 THÊM PHẦN NHẮC NHỞ / CẢM ƠN */}
              {item.status === "APPROVED" && (
                <p
                  style={{
                    color: "#faad14",
                    fontStyle: "italic",
                    marginTop: 8,
                  }}
                >
                  ⚠️ Vui lòng đến đúng giờ để hoàn thành hiến máu.
                </p>
              )}
              {item.status === "FULFILLED" && (
                <p
                  style={{
                    color: "#52c41a",
                    fontStyle: "italic",
                    marginTop: 8,
                  }}
                >
                  🎉 Cảm ơn bạn đã hiến máu! Hãy nghỉ ngơi và trở lại sau 10–14
                  ngày nếu muốn tiếp tục đóng góp 💖
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
