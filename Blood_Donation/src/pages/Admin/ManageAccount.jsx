// Tag: for different colors of the boolean "enabled"
// fetchAccounts: THE async thunk used to fetch API data
import { Table, Tag, Space, Modal } from "antd";
import {
  FileSearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts } from "../../redux/features/accountSlice";
import { useEffect, useState } from "react";

function AccountTable() {
  const dispatch = useDispatch();
  // B1: declare the "state" var, assign it with state.accounts (the slice state), which returned by useSelector()
  // B2: assign the "state" var to the 3 vars (accounts, loading, error) and use it throughout this file

  // note: "data: accounts" mean take the "data" property from accounts slice and assign it to a new var called "accounts"
  // this is just for clarity
  const { data: accounts, loading, error } = useSelector((state) => state.account);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  // State for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };


  // Columns of the displayed table
  // title: the header text display on the web
  // dataIndex: the key (field)'s name that the API return, specify the exact name to get the value
  // key: used internally by React
  const columns = [
    {
      title: "UserID",
      dataIndex: "userID",
      key: "userID",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Họ và Tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Trạng thái",
      dataIndex: "enabled",
      key: "enabled",
      render: (enabled) => enabled ? (
        <Tag color="green">Đang hoạt động</Tag>
      ) :
        (
          <Tag color="red">Đã tắt</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <FileSearchOutlined
            style={{ cursor: "pointer" }}
            onClick={() => showModal(record)}
          />
          <EditOutlined />
          <DeleteOutlined />
        </Space>
      ),
    },
  ];

  // Loading and error state of the async thunk from redux
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Actual table return
  return (
    <>
      <Table dataSource={accounts} columns={columns} />
      <Modal
        title="Thông tin tài khoản"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <p><b>UserID:</b> {selectedRecord.userID}</p>
            <p><b>Username:</b> {selectedRecord.username}</p>
            <p><b>Họ và Tên:</b> {selectedRecord.fullName}</p>
            <p><b>Email:</b> {selectedRecord.email}</p>
            <p><b>Số điện thoại:</b> {selectedRecord.phone}</p>
            <p><b>Địa chỉ:</b> {selectedRecord.address}</p>
            <p><b>CCCD:</b> {selectedRecord.cccd}</p>
            <p><b>Nhóm máu:</b> {selectedRecord.typeBlood}</p>
            <p><b>Vai trò:</b> {selectedRecord.role}</p>
            <p><b>Giới tính:</b> {selectedRecord.gender}</p>
            <p><b>Ngày sinh:</b> {selectedRecord.birthdate}</p>
            <p><b>Trạng thái:</b> {selectedRecord.enabled ? "Đang hoạt động" : "Đã tắt"}</p>
          </div>
        )}
      </Modal>
    </>

  );
}

export default AccountTable;
