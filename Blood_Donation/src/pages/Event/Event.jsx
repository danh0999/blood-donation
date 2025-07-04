// src/pages/Event/Event.jsx
import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Card } from "antd";
import { Button } from "../../components/Button/Button";
import { IoMdTime } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineDescription } from "react-icons/md";
import { EventDetail } from "../../components/EventDetail/EventDetail";

export const Event = () => {
  const { container, title, description, list, card, iconText } = styles;
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowDetail = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const mockEvents = [
    {
      id: 1,
      hospitalName: "Bệnh viện Chợ Rẫy",
      date: "10/07/2025",
      time: "8:00 - 11:30",
      location: "201B Nguyễn Chí Thanh, Quận 5, TP.HCM",
      description: "Chương trình hiến máu định kỳ tháng 7",
      fullDescription:
        "Sự kiện hiến máu định kỳ nhằm bổ sung ngân hàng máu và nâng cao ý thức cộng đồng về hiến máu nhân đạo.",
      bloodTypes: "O+, A-",
      registeredCount: 52,
      contact: "Hotline: 1900 9090",
      image:
        "https://vienhuyethoc.vn/wp-content/uploads/2021/07/DSC_2194_zing.jpg",
    },
    {
      id: 2,
      hospitalName: "Bệnh viện 115",
      date: "14/07/2025",
      time: "13:30 - 16:00",
      location: "527 Sư Vạn Hạnh, Quận 10, TP.HCM",
      description: "Ngày hội giọt hồng yêu thương",
      fullDescription:
        "Sự kiện đặc biệt kết hợp với Hội Chữ thập đỏ nhằm kêu gọi hiến máu cộng đồng.",
      bloodTypes: "B+, AB+",
      registeredCount: 35,
      contact: "Hotline: 1800 115",
      image:
        "https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/640/324455921873985536/2022/10/6/1-16650233162571520539210.jpg",
    },
    {
      id: 3,
      hospitalName: "Bệnh viện Đà Nẵng",
      date: "20/07/2025",
      time: "9:00 - 12:00",
      location: "124 Hải Phòng, Quận Hải Châu, Đà Nẵng",
      description: "Hiến máu cứu người - Một nghĩa cử cao đẹp",
      fullDescription:
        "Chương trình kết hợp tuyên truyền giáo dục sức khỏe và hiến máu tự nguyện cho sinh viên.",
      bloodTypes: "A+, O-",
      registeredCount: 78,
      contact: "Hotline: 0236 1022",
      image:
        "https://media.vov.vn/sites/default/files/styles/large_watermark/public/2024-02/can_bo_nhan_vien_y_te_benh_vien_da_nang_tham_gia_hien_mau_dau_xuan.nguoi_dan_da_nang_dang_ky_hien_mau_tai_benh_vien.nguoi_dan_da_nang_hien_mau_dau_xuan._.jpg",
    },
  ];

  return (
    <div className={container}>
      <h2 className={title}>Chương trình hiến máu</h2>
      <p className={description}>
        Dưới đây là danh sách các chương trình hiến máu do bệnh viện tổ chức.
        Bạn có thể theo dõi lịch trình và tham gia khi phù hợp.
      </p>

      <div className={list}>
        {mockEvents.map((event) => (
          <Card key={event.id} title={event.hospitalName} className={card}>
            <div className={iconText}>
              <span className={styles.label}>
                <IoMdTime />
                Thời gian:
              </span>
              <span>{event.time}</span>
            </div>
            <div className={iconText}>
              <span className={styles.label}>
                <CiLocationOn />
                Địa điểm:
              </span>
              <span>{event.location}</span>
            </div>
            <div className={iconText}>
              <span className={styles.label}>
                <MdOutlineDescription />
                Mô tả:
              </span>
              <span>{event.description}</span>
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
// This code defines the Event component which displays a list of blood donation events.
