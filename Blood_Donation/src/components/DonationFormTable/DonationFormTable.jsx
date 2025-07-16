import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Tabs,
  Tooltip,
  message,
  Form,
  Input,
  DatePicker,
  Select
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllAppointments,
  updateAppointmentStatus,
  createDonationDetail,
} from "../../redux/features/donationFormSlice";
import styles from "./styles.module.scss";

const { TabPane } = Tabs;

function DonationFormTable({ demoData = [] }) {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state.donationForm);
  const user = useSelector((state) => state.user);

  const [selectedForm, setSelectedForm] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [donationModalVisible, setDonationModalVisible] = useState(false);
  const [donationForm] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAllAppointments());
  }, [dispatch]);

  const statusColors = {
    PENDING: "gold",
    APPROVED: "blue",
    REJECTED: "red",
    FULFILLED: "green",
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

  const handleSubmitDonation = (values) => {
    const payload = {
      ...values,
      appointmentId: selectedForm.id,
      staffId: user.userID,
      memberId: 8,
    };
    dispatch(createDonationDetail(payload))
      .unwrap()
      .then(() => {
        message.success("Lưu thông tin hiến máu thành công!");
        dispatch(updateAppointmentStatus({ id: selectedForm.id, status: "FULFILLED" }));
        setDonationModalVisible(false);
        donationForm.resetFields();
      })
      .catch(() => message.error("Lỗi khi lưu thông tin hiến máu"));
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Button
            type="default"
            onClick={() => handleViewForm(record)}
            size="small"
          >
            Xem phiếu
          </Button>

          <Button
            type="primary"
            size="small"
            disabled={record.status !== "APPROVED"}
            onClick={() => {
              setSelectedForm(record);
              setDonationModalVisible(true);
            }}
          >
            Nhập thông tin hiến máu
          </Button>

          <Select
            size="small"
            defaultValue={record.status}
            style={{ width: 140 }}
            onChange={(newStatus) => handleStatusUpdate(record.id, newStatus)}
          >
            <Select.Option value="PENDING">PENDING</Select.Option>
            <Select.Option value="APPROVED">APPROVED</Select.Option>
            <Select.Option value="REJECTED">REJECTED</Select.Option>
            <Select.Option value="FULFILLED">FULFILLED</Select.Option>
            <Select.Option value="CANCELLED">CANCELLED</Select.Option>
          </Select>
        </div>
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
                    if (a.status === "PENDING" && b.status !== "PENDING") return -1;
                    if (b.status === "PENDING" && a.status !== "PENDING") return 1;
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
              onClick={() => {
                if (window.confirm("Bạn có chắc chắn muốn từ chối phiếu này?")) {
                  handleStatusUpdate(selectedForm.id, "REJECTED");
                }
              }}
            >
              Từ chối
            </Button>,
            <Button
              key="approve"
              type="primary"
              onClick={() => {
                if (window.confirm("Bạn có chắc chắn muốn phê duyệt phiếu này?")) {
                  handleStatusUpdate(selectedForm.id, "APPROVED");
                }
              }}
            >
              Phê duyệt
            </Button>,
          ]
        }

      >
        {selectedForm ? (
          <div>
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <b>{`${i + 1}. Câu hỏi khảo sát`}</b>
                <p style={{ margin: "4px 0 0 12px" }}>
                  {selectedForm[`answer${i + 1}`] || "Không có câu trả lời"}
                </p>
              </div>
            ))}
            <hr style={{ margin: "16px 0" }} />
            <p><b>Địa chỉ:</b> {selectedForm.address || "Không rõ"}</p>
            <p><b>Khung giờ:</b> {selectedForm.timeRange || "Không rõ"}</p>
          </div>
        ) : (
          <p>Không có dữ liệu phiếu.</p>
        )}
      </Modal>

      <Modal
        title={`Nhập thông tin hiến máu - Mã lịch hẹn #${selectedForm?.id}`}
        open={donationModalVisible}
        onCancel={() => setDonationModalVisible(false)}
        onOk={() => donationForm.submit()}
        okText="Lưu"
      >
        <Form layout="vertical" form={donationForm} onFinish={handleSubmitDonation}>
          <Form.Item
            label="Số lượng (ml)"
            name="donAmount"
            rules={[{ required: true, message: "Nhập số lượng hiến máu" }]}
          >
            <Select placeholder="Chọn đơn vị (ml)">
              <Option value={200}>200ml</Option>
              <Option value={350}>350ml</Option>
              <Option value={500}>500ml</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ngày hiến máu"
            name="donDate"
            rules={[{ required: true, message: "Chọn ngày hiến máu" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Nhóm máu"
            name="bloodType"
            rules={[{ required: true, message: "Chọn nhóm máu" }]}
          >
            <Select placeholder="Nhóm máu">
              <Option value={1}>A</Option>
              <Option value={2}>B</Option>
              <Option value={3}>AB</Option>
              <Option value={4}>O</Option>
            </Select>
          </Form.Item>
        </Form>

      </Modal>
    </div>
  );
}

export default DonationFormTable;