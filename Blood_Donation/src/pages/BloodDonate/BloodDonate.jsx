import React, { useState } from "react";
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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const user = useSelector((state) => state.user);
  const currentAppointment = useSelector(
    (state) => state.bloodHistory.currentAppointment
  );

  // 👉 Check hợp lệ: chỉ hiển thị lịch nếu không phải FULFILLED hoặc CANCELLED
  const isValidAppointment =
    currentAppointment &&
    currentAppointment.status !== "FULFILLED" &&
    currentAppointment.status !== "CANCELLED";

  const handleRegister = () => {
    navigate("/user/donate/schedule");
  };

  const handleDelete = async () => {
    if (!currentAppointment) return;

    try {
      await api.delete(
        `/appointments/${currentAppointment.id}/with-permission`,
        {
          params: {
            username: user.username,
          },
        }
      );

      dispatch(clearDonationHistory());
      dispatch(clearCurrentAppointment());
      toast.success("🗑️ Xóa đơn đăng ký thành công!");
      setIsModalVisible(false);
      navigate("/user/bloodDonate");
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
            <strong>Ngày sinh:</strong> {user?.dob || "-"}
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
          {isValidAppointment ? (
            <>
              <p>Bạn đã đăng ký hiến máu tại:</p>
              <p className={styles.address}>{currentAppointment.address}</p>
              <p>
                <strong>Thời gian:</strong> {currentAppointment.time}
              </p>
            </>
          ) : (
            <p className={styles.noData}>Chưa có phiếu đăng ký hiến máu</p>
          )}
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        {isValidAppointment ? (
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
          <Button type="primary" onClick={handleRegister}>
            Đăng ký hiến máu
          </Button>
        )}
      </div>
    </div>
  );
};

export default BloodDonate;
