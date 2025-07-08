import React from "react";
import { Table, Button, Space } from "antd";
import SearchBarV2 from "../../../components/SearchBarV2/SearchBarV2";

const columns = [
  {
    title: "ProgramID",
    dataIndex: "programID",
    key: "programID",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Participants",
    dataIndex: "participants",
    key: "participants",
    render: (text, record) => `${record.currentParticipants}/${record.maxParticipants}`,
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <Space size="middle">
        <Button type="link">View</Button>
        <Button type="link">Edit</Button>
        <Button type="link" danger>Delete</Button>
      </Space>
    ),
  },
];

// Example data
const data = [
  {
    key: 1,
    programID: "P001",
    name: "Blood Drive July",
    currentParticipants: 50,
    maxParticipants: 100,
    startDate: "2025-07-01",
    endDate: "2025-07-10",
  },
  {
    key: 2,
    programID: "P002",
    name: "Summer Donation",
    currentParticipants: 80,
    maxParticipants: 120,
    startDate: "2025-08-01",
    endDate: "2025-08-15",
  },
  {
    key: 3,
    programID: "P002",
    name: "Summer Donation",
    currentParticipants: 80,
    maxParticipants: 120,
    startDate: "2025-08-01",
    endDate: "2025-08-15",
  },
  {
    key: 4,
    programID: "P002",
    name: "Summer Donation",
    currentParticipants: 80,
    maxParticipants: 120,
    startDate: "2025-08-01",
    endDate: "2025-08-15",
  },
  {
    key: 5,
    programID: "P002",
    name: "Summer Donation",
    currentParticipants: 80,
    maxParticipants: 120,
    startDate: "2025-08-01",
    endDate: "2025-08-15",
  },
  {
    key: 6,
    programID: "P002",
    name: "Summer Donation",
    currentParticipants: 80,
    maxParticipants: 120,
    startDate: "2025-08-01",
    endDate: "2025-08-15",
  },
  {
    key: 7,
    programID: "P002",
    name: "Summer Donation",
    currentParticipants: 80,
    maxParticipants: 120,
    startDate: "2025-08-01",
    endDate: "2025-08-15",
  },
  {
    key: 8,
    programID: "P002",
    name: "Summer Donation",
    currentParticipants: 80,
    maxParticipants: 120,
    startDate: "2025-08-01",
    endDate: "2025-08-15",
  },
  {
    key: 9,
    programID: "P002",
    name: "Summer Donation",
    currentParticipants: 80,
    maxParticipants: 120,
    startDate: "2025-08-01",
    endDate: "2025-08-15",
  },
  {
    key: 10,
    programID: "P002",
    name: "Summer Donation",
    currentParticipants: 80,
    maxParticipants: 120,
    startDate: "2025-08-01",
    endDate: "2025-08-15",
  },
];

const ProgramTable = () => {
  return (
    <>
      <Table columns={columns} dataSource={data} pagination={true} />
    </>
  );
};

export default ProgramTable;
