// Tag: for different colors of the boolean "enabled"
// fetchAccounts: THE async thunk used to fetch API data
import { Table, Tag, Space, Modal, Button } from "antd";
import {
  FileSearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts, deleteAccountById } from "../../redux/features/accountSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AccountTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // B1: declare the "state" var, assign it with state.accounts (the slice state), which returned by useSelector()
  // B2: assign the "state" var to the 3 vars (accounts, loading, error) and use it throughout this file

  // note: "data: accounts" mean take the "data" property from accounts slice and assign it to a new var called "accounts"
  // this is just for clarity
  const { data: accounts, loading, error } = useSelector((state) => state.account);

  // State for delete modal and countdown
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(true);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  // Countdown logic for delete button
  useEffect(() => {
    let timer;
    if (deleteModalVisible && deleteBtnDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setDeleteBtnDisabled(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [deleteModalVisible, deleteBtnDisabled]);

  const showDeleteModal = (record) => {
    setDeleteTarget(record);
    setDeleteModalVisible(true);
    setCountdown(3);
    setDeleteBtnDisabled(true);
  };

  const handleDelete = async () => {
    await dispatch(deleteAccountById(deleteTarget.userID));
    setDeleteModalVisible(false);
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
            onClick={() => navigate(`/admin/accounts/${record.userID}`)}
          />
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => showDeleteModal(record)}
          />
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

      {/* Modals */}
      <Modal
        title="Xác nhận xóa tài khoản"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            disabled={deleteBtnDisabled}
            onClick={handleDelete}
          >
            {deleteBtnDisabled ? `Xóa (${countdown})` : "Xóa"}
          </Button>,
        ]}
      >
        {deleteTarget && (
          <>
            Bạn có chắc chắn muốn xóa tài khoản <b>{deleteTarget.username}</b> (UserID: {deleteTarget.userID})? Hành động này không thể hoàn tác.
          </>
        )}
      </Modal>
    </>
  );
}

export default AccountTable;
