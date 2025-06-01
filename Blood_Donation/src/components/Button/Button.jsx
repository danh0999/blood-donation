import React from "react";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";

export const Button = () => {
  const { buttonContainer, button } = styles;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/information");
  };

  return (
    <div className={buttonContainer}>
      <button className={button} onClick={handleClick}>
        Tìm hiểu thêm
      </button>
    </div>
  );
};
