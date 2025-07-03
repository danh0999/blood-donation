import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountById } from "../../../redux/features/accountSlice";
import { Card, Descriptions, Row, Col, Button, Space } from "antd";

const AccountDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAccount, selectedLoading, selectedError } = useSelector((state) => state.account);

  useEffect(() => {
    if (id) {
      dispatch(fetchAccountById(id));
    }
  }, [dispatch, id]);

  if (selectedLoading) return <div>Loading...</div>;
  if (selectedError) return <div>Error: {selectedError}</div>;
  if (!selectedAccount) return <div>No account found.</div>;

  return (
    <Card title={`Chi tiết tài khoản: ${selectedAccount.username}`}>  
      <Row gutter={32}>
        <Col xs={24} md={12}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 500, fontSize: 16 }}>Thông tin tài khoản</span>
            <Button type="default" size="small" disabled>Cập nhật</Button>
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
            <Button type="default" size="small" disabled>Cập nhật</Button>
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
      <Button type="primary" onClick={() => navigate(-1)} style={{ marginTop: 32 }}>
        Quay lại
      </Button>
    </Card>
  );
};

export default AccountDetail;
