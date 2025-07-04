import React from "react";
import { DatePicker, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import styles from "../SearchBar/SearchBar.module.scss";
import { Button } from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;
const { Text } = Typography;

const SearchBar = ({ onSearch }) => {
  const [selectedRange, setSelectedRange] = React.useState(null);
  const navigate = useNavigate();
  const handleRangeChange = (value, dateString) => {
    setSelectedRange(value);
    console.log("Formatted Selected Time: ", dateString);
  };

  const handleClick = () => {
    if (selectedRange && onSearch) {
      onSearch(selectedRange);
    } else {
      console.log("Please select a date range.");
    }
    navigate("/event");
  };

  return (
    <div className={styles.searchBox}>
      <Text strong className={styles.searchTitle}>
        <CalendarOutlined style={{ marginRight: 8 }} />
        Bạn cần đặt lịch vào thời gian nào?
      </Text>

      <div className={styles.searchContainer}>
        <RangePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          placeholder={["Từ ngày", "Đến ngày"]}
          onChange={handleRangeChange}
          className={styles.rangePicker}
        />
        <Button
          type="primary"
          className={styles.searchButton}
          onClick={handleClick}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};
export default SearchBar;
