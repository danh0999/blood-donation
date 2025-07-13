import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Modal, Tabs, Tooltip, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllAppointments,
  updateAppointmentStatus,
} from "../../redux/features/donationFormSlice";
import styles from "./styles.module.scss";

const { TabPane } = Tabs;

function DonationFormTable({ demoData = [] }) {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state.donationForm);

  const [selectedForm, setSelectedForm] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchAllAppointments());
    }, [dispatch]);

  const statusColors = {
    PENDING: "gold",
    APPROVED: "green",
    REJECTED: "red",
  };

  const handleViewForm = (record) => {
    setSelectedForm(record);
    setModalVisible(true);
  };

  const handleStatusUpdate = (id, newStatus) => {
    dispatch(updateAppointmentStatus({ id, status: newStatus }))
      .unwrap()
      .then(() => {
        message.success(`Cập nhật trạng thái thành công: ${newStatus}`);
        setModalVisible(false);
      })
      .catch(() => {
        message.error("Có lỗi xảy ra khi cập nhật trạng thái");
      });
  };

  const appointmentColumns = [
    {
      title: "Mã Lịch Hẹn",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      title: "Điện Thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewForm(record)}>
          Xem phiếu
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.title}>Quản lý Lịch Hẹn Hiến Máu</h3>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Lịch hẹn" key="1">
          <Table
            columns={appointmentColumns}
            dataSource={
              Array.isArray(appointments) && appointments.length > 0
                ? [...appointments].sort((a, b) => {
                  // 1. Show PENDING first
                  if (a.status === "PENDING" && b.status !== "PENDING") return -1;
                  if (b.status === "PENDING" && a.status !== "PENDING") return 1;

                  // 2. Within same status, sort by farthest date first
                  return new Date(b.date) - new Date(a.date);
                })
                : demoData
            }

            rowKey="id"
            loading={loading}
            bordered
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab="Chi tiết hiến máu" key="2">
          {/* Content for Donation Detail Tab (to be implemented) */}
          <p>Chưa có dữ liệu.</p>
        </TabPane>
      </Tabs>

      <Modal
        title={`Phiếu khảo sát - Mã lịch hẹn #${selectedForm?.id}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={
          selectedForm?.status === "PENDING" && [
            <Button
              key="reject"
              danger
              onClick={() => handleStatusUpdate(selectedForm.id, "REJECTED")}
            >
              Từ chối
            </Button>,
            <Button
              key="approve"
              type="primary"
              onClick={() => handleStatusUpdate(selectedForm.id, "APPROVED")}
            >
              Phê duyệt
            </Button>,
          ]
        }
      >
        {selectedForm ? (
          <div>
            {[
              "1. Anh/chị từng hiến máu chưa?",
              "2. Hiện tại, anh/chị có mắc bệnh lý nào không?",
              "3. Trước đây, anh/chị có từng mắc một trong các bệnh ...?",
              "4. Trong 12 tháng gần đây, anh/chị có:",
              "5. Trong 06 tháng gần đây, anh/chị có:",
              "6. Trong 01 tháng gần đây, anh/chị có:",
              "7. Trong 14 ngày gần đây, anh/chị có:",
              "8. Trong 07 ngày gần đây, anh/chị có:",
              "9. Câu hỏi dành cho phụ nữ:",
            ].map((question, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <b>{question}</b>
                <p style={{ margin: "4px 0 0 12px" }}>
                  {selectedForm[`answer${i + 1}`] || "Không có câu trả lời"}
                </p>
              </div>
            ))}

            <hr style={{ margin: "16px 0" }} />

            <p>
              <b>Địa chỉ:</b> {selectedForm.address || "Không rõ"}
            </p>
            <p>
              <b>Khung giờ:</b> {selectedForm.timeRange || "Không rõ"}
            </p>
          </div>
        ) : (
          <p>Không có dữ liệu phiếu.</p>
        )}
      </Modal>

    </div>
  );
}

export default DonationFormTable;
