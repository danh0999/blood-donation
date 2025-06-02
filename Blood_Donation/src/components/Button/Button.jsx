import React from "react";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";

export const Button = ({ content = "Tìm hiểu thêm", to }) => {
  const { buttonContainer, button } = styles;
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
    // Nếu không có to thì không làm gì cả hoặc làm việc khác
  };

  return (
    <div className={buttonContainer}>
      <button className={button} onClick={handleClick}>
        {content}
      </button>
    </div>
  );
};
