import React from "react";
import styles from "../DonorBenefit/styles.module.scss";
import benefitImage from "../../assets/benefit_image.jpg"; // hoặc ảnh tương tự bạn có

const DonorBenefits = () => {
  return (
    <div className={styles["donor-benefits-container"]}>
      <div className={styles["left-panel"]}>
        <h2>Quyền lợi của người hiến máu</h2>
        <p>Người hiến máu tình nguyện sẽ được những quyền lợi sau:</p>
        <img
          src={benefitImage}
          alt="Lợi ích hiến máu"
          className={styles["image"]}
        />
      </div>
      <div className={styles["right-panel"]}>
        <h3>Được bồi dưỡng trực tiếp</h3>
        <ul>
          <li>
            Ăn nhẹ, nước uống tại chỗ: tương đương 1 chai trà xanh không độ, 1
            hộp cháo 66g, 1 hộp bánh Goute 35,5g.
          </li>
          <li>Hỗ trợ chi phí đi lại (bằng tiền mặt): 50.000đ</li>
          <li>
            Nhận quà tặng giá trị tương đương:
            <ul>
              <li>100.000đ khi hiến máu 250ml</li>
              <li>150.000đ khi hiến máu 350ml</li>
              <li>180.000đ khi hiến máu 450ml</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DonorBenefits;
