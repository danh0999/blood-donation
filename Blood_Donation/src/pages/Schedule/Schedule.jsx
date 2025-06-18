// src/pages/Schedule/Schedule.jsx
import React, { useState } from "react";
import styles from "./styles.module.scss";

import { Button } from "../../components/Button/Button";
import { DateSelector } from "../../components/DateSelector/DateSelector";
import { LocationSelector } from "../../components/LocationSelector/LocationSelector";

export const Schedule = () => {
  const { container, title, section } = styles;

  const [selectedDate, setSelectedDate] = useState(null);
  const [location, setLocation] = useState("");

  const handleContinue = () => {
    if (!selectedDate || !location) {
      alert("Vui lòng chọn ngày và địa điểm.");
      return;
    }
    console.log("Ngày:", selectedDate, "Địa điểm:", location);
    // Chuyển hướng hoặc xử lý tiếp ở đây
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
