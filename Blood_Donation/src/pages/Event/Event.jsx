// src/pages/Event/Event.jsx
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Card, message } from "antd";
import { Button } from "../../components/Button/Button";
import { IoMdTime } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineDescription } from "react-icons/md";
import { EventDetail } from "../../components/EventDetail/EventDetail";
import { useLocation } from "react-router-dom";
import api from "../../configs/axios";

export const Event = () => {
  const { container, title, description, list, card, iconText } = styles;
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [slots, setSlots] = useState([]);
  const location = useLocation();

  const handleShowDetail = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const fetchPrograms = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const start = queryParams.get("startDate"); // ✅ Đổi thành startDate
      const end = queryParams.get("endDate"); // ✅ Đổi thành endDate

      let res;
      if (start) {
        res = await api.get(
          `/programs/search-range?startDate=${start}&endDate=${end || ""}`
        );
      } else {
        res = await api.get("/programs");
      }
      setPrograms(res.data);
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi tải danh sách chương trình");
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await api.get("/slots");
      setSlots(res.data);
    } catch (error) {
      console.log(error);

      message.error("Lỗi khi tải danh sách thời gian (slots)");
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchSlots();
  }, [location.search]);

  // Lấy thời gian từ danh sách slot dựa trên program.slotIds
  const getTimeRange = (slotIds) => {
    const ranges = slotIds
      .map((id) => {
        const slot = slots.find((s) => s.slotID === id);
        return slot ? `${slot.start} - ${slot.end}` : null;
      })
      .filter(Boolean);
    return ranges.join(", ");
  };

  return (
    <div className={container}>
      <h2 className={title}>Chương trình hiến máu</h2>
      <p className={description}>
        Dưới đây là danh sách các chương trình hiến máu do bệnh viện tổ chức.
        Bạn có thể theo dõi lịch trình và tham gia khi phù hợp.
      </p>

      <div className={list}>
        {programs.map((event) => (
          <Card key={event.id} title={event.proName} className={card}>
            <div className={iconText}>
              <span className={styles.label}>
                <IoMdTime />
                Thời gian:
              </span>
              <span>{getTimeRange(event.slotIds)}</span>
            </div>
            <div className={iconText}>
              <span className={styles.label}>📅 Ngày bắt đầu:</span>
              <span>{event.startDate}</span>
            </div>

            <div className={iconText}>
              <span className={styles.label}>🗓️ Ngày kết thúc:</span>
              <span>{event.endDate}</span>
            </div>
            <div className={iconText}>
              <span className={styles.label}>
                <CiLocationOn />
                Địa điểm:
              </span>
              <span>{event.address}</span>
            </div>
            <div className={iconText}>
              <span className={styles.label}>
                <MdOutlineDescription />
                Mô tả:
              </span>
              <span>{event.proName}</span>
            </div>

            <Button
              content="Xem chi tiết"
              onClick={() => handleShowDetail(event)}
            />
          </Card>
        ))}
      </div>

      {/* 🔍 Popup chi tiết sự kiện */}
      {selectedEvent && (
        <EventDetail
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
        />
      )}
    </div>
  );
};
