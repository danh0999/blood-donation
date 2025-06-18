import React from "react";
import styles from "../BloodDonate/styles.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal, message } from "antd";
import { clearHistory } from "../../redux/features/bloodHistorySlice";
import { useNavigate } from "react-router-dom";

const BloodDonate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const { donationHistory } = useSelector((state) => state.bloodHistory);
  const historyItem = donationHistory?.[0];

  const handleRegister = () => {
    // TODO: Gọi API đăng ký hiến máu tại đây
    // message.success("Đăng ký hiến máu thành công!");
    navigate("/schedule");
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Xác nhận hủy đăng ký",
      content: "Bạn có chắc muốn xóa đơn đăng ký hiến máu này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        // TODO: Gọi API xóa đơn đăng ký
        dispatch(clearHistory());
        message.success("Xóa đơn đăng ký thành công!");
      },
    });
  };

  return (
    <div className={styles.registrationWrapper}>
      <h2>Thông tin đăng ký hiến máu</h2>

      <div className={styles.cardContainer}>
        {/* Thông tin cá nhân */}
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
            <strong>Nghề nghiệp:</strong> {user?.career || "-"}
          </p>
          <p>
            <strong>Đơn vị:</strong> {user?.organization || "-"}
          </p>
        </div>

        {/* Lịch đăng ký hiến máu */}
        <div className={styles.card}>
          <h3>Phiếu đăng ký hiến máu</h3>
          {historyItem ? (
            <>
              <p>Bạn đã đăng ký hiến máu tại:</p>
              <p className={styles.address}>{historyItem.address}</p>
              <p>
                <strong>Thời gian:</strong> {historyItem.time}
              </p>
            </>
          ) : (
            <p className={styles.noData}>Chưa có phiếu đăng ký hiến máu</p>
          )}
        </div>
      </div>

      {/* Button */}
      <div className={styles.buttonWrapper}>
        {historyItem ? (
          <Button danger type="primary" onClick={handleDelete}>
            Xóa đơn đăng ký
          </Button>
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
