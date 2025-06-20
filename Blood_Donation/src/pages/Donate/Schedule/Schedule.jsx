// src/pages/Donate/Schedule/Schedule.jsx
import React, { useState } from "react";
import styles from "./styles.module.scss";

import { Button } from "../../../components/Button/Button";
import { DateSelector } from "../../../components/DateSelector/DateSelector";
import { LocationSelector } from "../../../components/LocationSelector/LocationSelector";
import { useNavigate } from "react-router-dom";

export const Schedule = () => {
  const { container, title, section } = styles;

  const [selectedDate, setSelectedDate] = useState(null);
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedDate || !location) {
      alert("Vui lòng chọn ngày và địa điểm.");
      return;
    }

    console.log("Ngày:", selectedDate, "Địa điểm:", location);
    navigate("checkup"); // 👈 Chuyển sang trang phiếu đăng ký
  };

  return (
    <div className={container}>
      <h2 className={title}>Thời gian & địa điểm</h2>

      <div className={section}>
        <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />
      </div>

      <div className={section}>
        <LocationSelector location={location} onChange={setLocation} />
      </div>

      <Button content="Tiếp tục" onClick={handleContinue} />
    </div>
  );
};
