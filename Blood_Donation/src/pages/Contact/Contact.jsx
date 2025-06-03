import React from 'react';
import styles from './styles.module.scss';
import { Button } from '../../components/Button/Button';

export const Contact = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* LEFT */}
        <div className={styles.left}>
          <h2>Liên hệ</h2>
          <ul className={styles.infoList}>
            <li>
              <span>Email:</span>
              <p>gmv@intelin.vn</p>
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
              <span>TT truyền máu Chợ Rẫy:</span>
              <p>028 39555885</p>
            </li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <h2>Gửi lời nhắn</h2>
          <p className={styles.desc}>
            Mọi thắc mắc về hiến máu tình nguyện, vui lòng gửi email tới <b>gmv@intelin.vn</b> hoặc điền thông tin bên dưới:
          </p>
          <form className={styles.form}>
            <input type="text" placeholder="Họ và tên" />
            <input type="email" placeholder="Email" />
            <textarea placeholder="Lời nhắn" rows="4" />
            <Button content="Gửi" type="submit" className={styles.submitButton}/>
          </form>
        </div>
      </div>
    </div>
  );
};
