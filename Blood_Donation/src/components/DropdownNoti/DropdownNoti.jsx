import React from "react";
import styles from "./styles.module.scss"; 
const DropdownNoti = ({ notifications = [], onClose }) => {
  return (
    <div className={styles.dropdown}>
      <div className={styles.header}>
        Thông báo
        <span className={styles.close} onClick={onClose}>
          ×
        </span>
      </div>
      <ul className={styles.list}>
        {notifications.length === 0 ? (
          <li className={styles.empty}>Không có thông báo</li>
        ) : (
          notifications.map((n, index) => (
            <li key={index} className={styles.item}>
              <div className={styles.message}>{n.message}</div>
              <div className={styles.time}>{n.time}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DropdownNoti;
