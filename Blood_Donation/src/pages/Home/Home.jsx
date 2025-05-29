import React from "react";
import { Carousel } from "antd";
import banner1 from "../../assets/banner1.jpg";
import banner2 from "../../assets/Banner2.jpg";
import banner3 from "../../assets/Banner3.jpg";
import DateRangeSearch from "../../components/SearchBar/SearchBar";
import styles from "../Home/Home.module.scss";

const imageStyle = {
  width: "100%",
  height: "400px",
  objectFit: "cover",
};

const Home = () => {
  const handleSearch = (range) => {
    const [start, end] = range;
    console.log("Start:", start.format("YYYY-MM-DD HH:mm"));
    console.log("End:", end.format("YYYY-MM-DD HH:mm"));
    // Bạn có thể xử lý thêm ở đây, ví dụ gọi API, lọc dữ liệu, ...
  };

  return (
    <div className={styles["home-container"]}>
      {/*Banner*/}
      <div className={styles["home-banner"]}>
        <Carousel autoplay>
          <div>
            <img src={banner1} alt="Banner 1" style={imageStyle} />
          </div>
          <div>
            <img src={banner2} alt="Banner 2" style={imageStyle} />
          </div>
          <div>
            <img src={banner3} alt="Banner 3" style={imageStyle} />
          </div>
        </Carousel>
      </div>

      {/* Component Search */}
      <div className={styles["home-search"]}>
        <DateRangeSearch onSearch={handleSearch} />
      </div>
      <div></div>
    </div>
  );
};

export default Home;
