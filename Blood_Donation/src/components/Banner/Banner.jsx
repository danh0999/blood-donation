import React from "react";
import { Carousel } from "antd";
import banner1 from "../../assets/banner1.jpg";
import banner2 from "../../assets/Banner2.jpg";

const imageStyle = {
  width: "100%",
  height: "500px",
  objectFit: "cover",
};
const Banner = () => (
  <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={3000}>
    <div>
      <img src={banner1} alt="Banner 1" style={imageStyle} />
    </div>
    <div>
      <img src={banner2} alt="Banner 2" style={imageStyle} />
    </div>
  </Carousel>
);
export default Banner;
