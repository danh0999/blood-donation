import React, { useState } from "react";
import { Table, Button, Space, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";
import ProgramSearchBar from "./ProgramSearchBar";

const { RangePicker } = DatePicker;

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

const ProgramTablePanel = () => {
  // Search/filter state
  const [category, setCategory] = useState("name");
  const [searchText, setSearchText] = useState("");
  // Store dateRange as string array for easier comparison
  const [dateRange, setDateRange] = useState(["", ""]);

  // Handler for date range change to get string values
  const handleDateRangeChange = (value, dateString) => {
    setDateRange(dateString);
  };

  // Filtering logic
  const filteredData = data.filter((item) => {
    if (category === "name") {
      return item.name.toLowerCase().includes(searchText.toLowerCase());
    } else if (category === "date") {
      if (!dateRange[0] || !dateRange[1]) return true;
      // Show programs whose startDate is within the selected range
      return (
        item.startDate >= dateRange[0] &&
        item.startDate <= dateRange[1]
      );
    }
    return true;
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem", justifyContent: "space-between" }}>
        <ProgramSearchBar
          category={category}
          onCategoryChange={setCategory}
          searchText={searchText}
          onSearchTextChange={setSearchText}
          dateRange={dateRange[0] && dateRange[1] ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : [null, null]}
          onDateRangeChange={handleDateRangeChange}
        />
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Button type="primary">
            Thêm chương trình
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={true} />
    </div>
  );
};

export default ProgramTablePanel;
