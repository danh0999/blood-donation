// src/components/EventDetail/EventDetail.jsx
import React from "react";
import { Modal, message } from "antd";
import styles from "./styles.module.scss";
import { IoMdTime } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineDescription } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { BsDropletHalf, BsImage } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { Button } from "../Button/Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedProgram } from "../../redux/features/bloodHistorySlice";
import api from "../../configs/axios";

export const EventDetail = ({ open, onClose, event }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await api.get(`/programs/${event.id}`); // 🔍 Gọi API lấy chi tiết
      const programDetail = res.data;

      dispatch(setSelectedProgram(programDetail)); // ✅ Lưu vào Redux
      navigate("/user/donate/schedule"); // 🔀 Điều hướng
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết chương trình:", error);
      message.error("Không thể tải thông tin chi tiết chương trình.");
    }
  };

  if (!event) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={event.proName || "Thông tin chương trình"}
      className={styles.modal}
    >
      <div className={styles.detailItem}>
        <FaCalendarAlt className={styles.icon} />
        <strong>Ngày tổ chức:</strong> <span>{event.startDate}</span>
      </div>

      <div className={styles.detailItem}>
        <IoMdTime className={styles.icon} />
        <strong>Thời gian:</strong> <span>{event.time}</span>
      </div>

      <div className={styles.detailItem}>
        <CiLocationOn className={styles.icon} />
        <strong>Địa điểm:</strong> <span>{event.address}</span>
      </div>

      <div className={styles.detailItem}>
        <BsDropletHalf className={styles.icon} />
        <strong>Loại máu:</strong> <span>{event.bloodTypes || "-"}</span>
      </div>

      <div className={styles.detailItem}>
        <MdOutlineDescription className={styles.icon} />
        <strong>Mô tả:</strong> <span>{event.fullDescription || "-"}</span>
      </div>

      <div className={styles.detailItem}>
        <FiPhone className={styles.icon} />
        <strong>Liên hệ:</strong> <span>{event.contact || "-"}</span>
      </div>

      <div className={styles.imageWrapper}>
        <BsImage className={styles.icon} />
        <img src={event.image} alt="Sự kiện" />
      </div>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <Button content="Đăng ký ngay" onClick={handleRegister} />
      </div>
    </Modal>
  );
};
