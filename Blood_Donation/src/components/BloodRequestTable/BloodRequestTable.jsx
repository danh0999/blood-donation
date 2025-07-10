import React, { useEffect } from "react";
import { Table, Tag, Tooltip } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBloodRequests } from "../../redux/features/bloodRequestSlice";
import styles from "./styles.module.scss";

function BloodRequestTable({ demoData = [] }) {
  const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);
// dummy data
const demoData2 = [
  {
    reqID: "REQ001",
    isEmergency: "yes",
    status: "PENDING",
    reqCreateDate: new Date().toISOString(),
    details: [
      { bloodType: "A+", packCount: 2, packVolume: 450 },
      { bloodType: "O-", packCount: 1, packVolume: 350 },
    ],
  },
  {
    reqID: "REQ002",
    isEmergency: "no",
    status: "APPROVED",
    reqCreateDate: new Date().toISOString(),
    details: [
      { bloodType: "B+", packCount: 3, packVolume: 500 },
    ],
  },
];

  const statusDescriptions = {
    PENDING: "PENDING: Trung tâm hiến máu đang xem xét yêu cầu của bạn. Vui lòng đợi.",
    APPROVED: "APPROVED: Yêu cầu đã được phê duyệt. Các túi máu sẽ được giao trong vòng 3–5 ngày tới. Nếu có thắc mắc, vui lòng liên hệ: 0123 456 789.",
    COMPLETED: "COMPLETED: Quá trình nhận máu đã hoàn tất. Cảm ơn bạn!",
    REJECTED: "REJECTED: Yêu cầu đã bị từ chối. Vui lòng kiểm tra lại thông tin hoặc liên hệ hỗ trợ.",
  };

  const { requestList, loading } = useSelector((state) => state.bloodRequest);

    // useEffect(() => {
    //     dispatch(fetchAllBloodRequests());
    // }, [dispatch]);

    useEffect(() => {
  if (!demoData || demoData.length === 0) {
    dispatch(fetchAllBloodRequests());
  }
}, [dispatch, demoData]);

  const columns = [
  {
    title: "Mã Yêu Cầu",
    dataIndex: "reqID",
    key: "reqID",
  },
  {
    title: "Khẩn Cấp",
    dataIndex: "isEmergency",
    key: "isEmergency",
    render: (value) => value?.toLowerCase() === "yes" ? <Tag color="red">Khẩn cấp</Tag> : <Tag color="green">Thường</Tag>,
  },
  {
    title: "Chi Tiết",
    dataIndex: "details",
    key: "details",
    render: (details) => (
  <ul style={{ paddingLeft: 20, margin: 0 }}>
    {Array.isArray(details) && details.length > 0 ? details.map((item, index) => (
      <li key={index}>
        Nhóm máu: <b>{item.bloodType}</b> | Số túi: {item.packCount} | Dung tích: {item.packVolume}ml
      </li>
    )) : <li>Không có dữ liệu</li>}
  </ul>
),
  },
  {
    title: "Trạng Thái",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let color = "default";
      if (status === "PENDING") color = "gold";
      else if (status === "APPROVED") color = "blue";
      else if (status === "COMPLETED") color = "green";
      else if (status === "REJECTED") color = "red";
      return (
      <Tooltip title={statusDescriptions[status]}>
        <Tag color={color} style={{ cursor: "pointer" }}>{status}</Tag>
      </Tooltip>
    );
    },
  },
  {
    title: "Ngày Tạo",
    dataIndex: "reqCreateDate",
    key: "reqCreateDate",
    render: (value) => new Date(value).toLocaleString("vi-VN"),
  },
];

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.title}>Danh sách yêu cầu máu</h3>
       <Table
        columns={columns}
        // dataSource={Array.isArray(requestList) ? requestList : demoData}
        dataSource={
          Array.isArray(requestList) && requestList.length > 0
            ? requestList
            : demoData
        }
        rowKey="reqID"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}

export default BloodRequestTable;
