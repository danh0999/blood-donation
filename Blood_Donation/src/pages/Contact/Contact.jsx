import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Button } from "../../components/Button/Button";

/**
 * Trang Liên Hệ: Người dùng có thể nhập họ tên, email và lời nhắn.
 * Hiện tại chưa tích hợp API gửi mail, chỉ hiển thị thông báo "Gửi thành công" khi hợp lệ.
 * Mục tiêu tương lai: Gửi dữ liệu form tới backend để gửi email đến gmv@intelin.vn.
 */
export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Xử lý khi người dùng nhập vào input/textarea
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Xóa lỗi tạm thời khi người dùng nhập lại
    setErrors({ ...errors, [name]: "" });
  };

  // Kiểm tra dữ liệu trước khi gửi
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Vui lòng nhập lời nhắn";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      /**
       * GHI CHÚ: Hiện tại chưa có backend, nên chỉ hiển thị thông báo thành công tạm thời.
       * SAU NÀY: Thay alert bằng gọi API POST tới server để gửi mail đến gmv@intelin.vn
       * Ví dụ:
       * await axios.post('/api/contact', formData)
       */
      alert("Gửi thành công!");

      // Reset form
      setFormData({ name: "", email: "", message: "" });
      setErrors({ name: "", email: "", message: "" });
    }
  };

  // Kiểm tra tổng thể hợp lệ trước khi bật nút submit
  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.message.trim();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Thông tin liên hệ hiển thị bên trái */}
        <div className={styles.left}>
          <h2>Liên hệ</h2>
          <ul className={styles.infoList}>
            <li>
              <span>Email:</span>
              <p>contact.bloodvn@gmail.com</p>
            </li>
            <li>
              <span>TT Hiến Máu Nhân Đạo:</span>
              <p>028 3868 5509</p>
              <p>028 3868 5507</p>
            </li>
            <li>
              <span>Bệnh viện BTH:</span>
              <p>028 39571342</p>
              <p>028 39557858</p>
            </li>
            <li>
              <span>TT truyền máu Chợ Rẩy:</span>
              <p>028 39555885</p>
            </li>
          </ul>
        </div>

        {/* Form gửi lời nhắn hiển thị bên phải */}
        <div className={styles.right}>
          <h2>Gửi lời nhắn</h2>
          <p className={styles.desc}>
            Mọi thắc mắc về hiến máu tình nguyện, vui lòng gửi email tới{" "}
            <b>contact.bloodvn@gmail.com</b> hoặc điền thông tin bên dưới:
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.inputError : ""}
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}

            <input
              type="text" // Không dùng type="email" để tránh cảnh báo mặc định
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`${errors.email ? styles.inputError : ""}`}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email}</span>
            )}

            <textarea
              name="message"
              placeholder="Lời nhắn"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? styles.inputError : ""}
            />
            {errors.message && (
              <span className={styles.error}>{errors.message}</span>
            )}

            <Button
              content="Gửi"
              type="submit"
              className={`${styles.submitButton} ${!isFormValid ? styles.disabled : ""}`}
              disabled={!isFormValid}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
