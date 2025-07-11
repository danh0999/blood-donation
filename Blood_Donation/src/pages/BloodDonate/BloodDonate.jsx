import React, { useState, useEffect } from "react";
import styles from "../BloodDonate/styles.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal } from "antd";
import {
  clearDonationHistory,
  clearCurrentAppointment,
} from "../../redux/features/bloodHistorySlice";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import { toast } from "react-toastify";

const BloodDonate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [status, setStatus] = useState(null); // PENDING | FULFILLED | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      try {
        const res = await api.get("/appointments/history", {
          params: { userId: user.userID },
        });

        const pending = res.data.find((item) => item.status === "PENDING");

        if (pending) {
          setAppointment(pending);
          setStatus("PENDING");
        } else {
          setStatus("FULFILLED");
        }
      } catch (error) {
        console.error("Lỗi khi fetch history:", error);
        setStatus("ERROR");
      } finally {
        setLoading(false);
      }
    };

    if (user?.userID) {
      fetchAppointmentHistory();
    }
  }, [user?.userID]);

  const handleRegister = () => {
    navigate("/user/donate/schedule");
  };

  const handleDelete = async () => {
    if (!appointment) return;

    try {
      await api.delete(`/appointments/${appointment.id}/with-permission`, {
        params: {
          username: user.username,
        },
      });

      dispatch(clearDonationHistory());
      dispatch(clearCurrentAppointment());
      toast.success("🗑️ Xóa đơn đăng ký thành công!");
      setIsModalVisible(false);
      setAppointment(null);
      setStatus("FULFILLED"); // cho phép đăng ký mới
    } catch (err) {
      console.error("Lỗi xóa appointment:", err.response?.data || err.message);
      toast.error("❌ Không thể xóa đơn đã hiến máu hoặc có lỗi xảy ra.");
    }
  };

  return (
    <div className={styles.registrationWrapper}>
      <h2>Thông tin đăng ký hiến máu</h2>

      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <h3>Thông tin cá nhân</h3>
          <p>
            <strong>Họ và tên:</strong> {user?.fullName || "-"}
          </p>
          <p>
            <strong>CCCD:</strong> {user?.cccd || "-"}
          </p>
          <p>
            <strong>Ngày sinh:</strong> {user?.birthdate || "-"}
          </p>
          <p>
            <strong>Giới tính:</strong> {user?.gender || "-"}
          </p>
          <p>
            <strong>Nhóm máu:</strong> {user?.typeBlood || "-"}
          </p>
        </div>

        <div className={styles.card}>
          <h3>Phiếu đăng ký hiến máu</h3>
          {loading ? (
            <p>Đang tải thông tin...</p>
          ) : status === "PENDING" ? (
            <>
              <p>Bạn đã đăng ký hiến máu tại:</p>
              <p className={styles.address}>{appointment.address}</p>
              <p>
                <strong>Thời gian:</strong> {appointment.time}
              </p>
            </>
          ) : (
            <p className={styles.noData}>Chưa có phiếu đăng ký hiến máu</p>
          )}
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        {!loading && status === "PENDING" ? (
          <>
            <Button
              danger
              type="primary"
              onClick={() => setIsModalVisible(true)}
            >
              Xóa đơn đăng ký
            </Button>
            <Modal
              title="Xác nhận hủy đăng ký"
              open={isModalVisible}
              onOk={handleDelete}
              onCancel={() => setIsModalVisible(false)}
              okText="Xác nhận"
              cancelText="Hủy"
              centered
            >
              <p>Bạn có chắc muốn xóa đơn đăng ký hiến máu này không?</p>
            </Modal>
          </>
        ) : (
          !loading && (
            <Button type="primary" onClick={handleRegister}>
              Đăng ký hiến máu
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default BloodDonate;
