import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import styles from "../AppointmentDetails/styles.module.scss";

const AppointmentDetail = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [donationDetail, setDonationDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointment
        const appointmentRes = await api.get(`/appointments/${id}`);
        setAppointment(appointmentRes.data);

        // Fetch donation detail using correct endpoint
        const donationRes = await api.get(
          `donation-details/by-appointment/${id}`
        );
        setDonationDetail(donationRes.data);
      } catch (error) {
        console.error(error);
        toast.error("Lỗi khi tải dữ liệu chi tiết lịch hẹn hoặc hiến máu");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className={styles.container}>
      <h3 className="mb-4">Chi tiết lịch hẹn</h3>
      <div className="card">
        <div className="card-body">
          {appointment ? (
            <>
              <p>
                <strong>Tên chương trình:</strong>{" "}
                {appointment.program?.name || "(Không có dữ liệu)"}
              </p>
              <p>
                <strong>Địa điểm:</strong> {appointment.address}
              </p>
              <p>
                <strong>Thời gian hiến máu:</strong> {appointment.date} (
                {appointment.timeRange})
              </p>
              <p>
                <strong>Trạng thái:</strong> {appointment.status}
              </p>
            </>
          ) : (
            <p>Đang tải thông tin lịch hẹn...</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h5>Chi tiết hiến máu</h5>
        <div className="card">
          <div className="card-body">
            {donationDetail ? (
              <>
                <p>
                  <strong>Số lượng hiến máu:</strong> {donationDetail.donAmount}{" "}
                  ml
                </p>
                <p>
                  <strong>Ngày hiến máu:</strong> {donationDetail.donDate}
                </p>
                <p>
                  <strong>Nhóm máu:</strong> {donationDetail.bloodType}
                </p>
              </>
            ) : (
              <p>Chưa có thông tin chi tiết hiến máu.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;