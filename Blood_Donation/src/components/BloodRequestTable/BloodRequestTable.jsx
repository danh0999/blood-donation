import React, { useEffect } from "react";
import { Table, Tag } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBloodRequests } from "../../redux/features/bloodRequestSlice";
import styles from "./styles.module.scss";

function BloodRequestTable() {
  const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);
  const { requestList, loading } = useSelector((state) => state.bloodRequest);

    useEffect(() => {
        dispatch(fetchAllBloodRequests());
    }, [dispatch]);

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
      return <Tag color={color}>{status}</Tag>;
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
        dataSource={Array.isArray(requestList) ? requestList : []}
        rowKey="reqID"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}

export default BloodRequestTable;
