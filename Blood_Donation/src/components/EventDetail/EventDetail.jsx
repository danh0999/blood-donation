// src/components/EventDetail/EventDetail.jsx
import React from "react";
import { Modal } from "antd";
import styles from "./styles.module.scss";
import { IoMdTime } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineDescription } from "react-icons/md";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";
import { BsDropletHalf, BsImage } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { Button } from "../Button/Button";

export const EventDetail = ({ open, onClose, event }) => {
  if (!event) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={event.hospitalName}
      className={styles.modal}
    >
      <div className={styles.detailItem}>
        <FaCalendarAlt className={styles.icon} />
        <strong>Ngày tổ chức:</strong> <span>{event.date}</span>
      </div>

      <div className={styles.detailItem}>
        <IoMdTime className={styles.icon} />
        <strong>Thời gian:</strong> <span>{event.time}</span>
      </div>

      <div className={styles.detailItem}>
        <CiLocationOn className={styles.icon} />
        <strong>Địa điểm:</strong> <span>{event.location}</span>
      </div>

      <div className={styles.detailItem}>
        <BsDropletHalf className={styles.icon} />
        <strong>Loại máu ưu tiên:</strong> <span>{event.bloodTypes}</span>
      </div>

      <div className={styles.detailItem}>
        <FaUsers className={styles.icon} />
        <strong>Đã có:</strong>{" "}
        <span>{event.registeredCount} người đăng ký</span>
      </div>

      <div className={styles.detailItem}>
        <MdOutlineDescription className={styles.icon} />
        <strong>Mô tả:</strong> <span>{event.fullDescription}</span>
      </div>

      <div className={styles.detailItem}>
        <FiPhone className={styles.icon} />
        <strong>Liên hệ:</strong> <span>{event.contact}</span>
      </div>

      <div className={styles.imageWrapper}>
        <BsImage className={styles.icon} />
        <img src={event.image} alt="Sự kiện" />
      </div>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <Button
          content="Đăng ký ngay"
          onClick={() => (window.location.href = "/user/donate/schedule")}
        />
      </div>
    </Modal>
  );
};
