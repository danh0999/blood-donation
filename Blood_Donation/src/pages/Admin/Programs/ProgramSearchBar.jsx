import React from "react";
import { DatePicker, Input, Select } from "antd";

const { RangePicker } = DatePicker;

/**
 * ProgramSearchBar: Search/filter bar for program table
 * - Allows switching between search by name and filter by date range
 * - Calls onCategoryChange, onSearchTextChange, onDateRangeChange as needed
 *
 * Props:
 *   category: string ("name" or "date")
 *   onCategoryChange: (string) => void
 *   searchText: string
 *   onSearchTextChange: (string) => void
 *   dateRange: [moment|null, moment|null]
 *   onDateRangeChange: ([moment|null, moment|null]) => void
 */
const ProgramSearchBar = ({
  category,
  onCategoryChange,
  searchText,
  onSearchTextChange,
  dateRange,
  onDateRangeChange,
}) => {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Select
        value={category}
        onChange={onCategoryChange}
        style={{ minWidth: 120 }}
        options={[
          { value: "name", label: "Tên" },
          { value: "date", label: "Ngày bắt đầu" },
        ]}
      />
      {category === "name" ? (
        <Input
          placeholder="Tìm kiếm theo tên chương trình..."
          value={searchText}
          onChange={e => onSearchTextChange(e.target.value)}
          style={{ minWidth: 220 }}
        />
      ) : (
        <RangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          format="YYYY-MM-DD"
          allowClear
          style={{ minWidth: 240 }}
          placeholder={["Từ ngày", "Đến ngày"]}
        />
      )}
    </div>
  );
};

export default ProgramSearchBar;
