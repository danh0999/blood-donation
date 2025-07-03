import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountById, deleteAccountById } from "../../../redux/features/accountSlice";
import { Card, Descriptions, Row, Col, Button, Space, Modal } from "antd";

const AccountDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // data fetching
  const { selectedAccount, selectedLoading, selectedError } = useSelector((state) => state.account);
  useEffect(() => {
    if (id) {
      dispatch(fetchAccountById(id));
    }
  }, [dispatch, id]);

  // State for delete modal and countdown
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(true);

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

  const showDeleteModal = () => {
    setDeleteModalVisible(true);
    setCountdown(3);
    setDeleteBtnDisabled(true);
  };

  const handleDelete = async () => {
    setDeleteModalVisible(false);
    if (id) {
      await dispatch(deleteAccountById(id));
      navigate(-1); // Go back after delete
    }
  };

  if (selectedLoading) return <div>Loading...</div>;
  if (selectedError) return <div>Error: {selectedError}</div>;
  if (!selectedAccount) return <div>No account found.</div>;

  return (
    <Card title={`Chi tiết tài khoản: ${selectedAccount.username}`}>  
      <Row gutter={32}>
        <Col xs={24} md={12}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 500, fontSize: 16 }}>Thông tin tài khoản</span>
            <Button type="default" size="small">Cập nhật</Button>
          </Space>
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="UserID">{selectedAccount.userID}</Descriptions.Item>
            <Descriptions.Item label="Username">{selectedAccount.username}</Descriptions.Item>
            <Descriptions.Item label="Vai trò">{selectedAccount.role}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{selectedAccount.enabled ? "Đang hoạt động" : "Đã vô hiệu"}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col xs={24} md={12}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 500, fontSize: 16 }}>Thông tin cá nhân</span>
            <Button type="default" size="small">Cập nhật</Button>
          </Space>
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Họ và Tên">{selectedAccount.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedAccount.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedAccount.phone}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{selectedAccount.address}</Descriptions.Item>
            <Descriptions.Item label="CCCD">{selectedAccount.cccd}</Descriptions.Item>
            <Descriptions.Item label="Nhóm máu">{selectedAccount.typeBlood}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{selectedAccount.gender}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{selectedAccount.birthdate}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Space style={{ marginTop: 32 }}>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <Button type="primary" danger onClick={showDeleteModal}>
          Xóa tài khoản
        </Button>
      </Space>
      
      
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
        Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.
      </Modal>
    </Card>
  );
};

export default AccountDetail;
