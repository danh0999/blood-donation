import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/Logo.png";
import { Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/features/userSlice";
import styles from "./Header.module.scss";

const { Header } = Layout;

const AppHeader = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const closeDropdown = () => setShowDropdown(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.topHeader}>
        <div className={styles.logoContainer}>
          <img src={Logo} alt="logo" className={styles.logo} />
        </div>

        <nav className={styles.navbar}>
          <ul className={styles.navList}>
            <li>
              <Link to="/">TRANG CHỦ</Link>
            </li>
            {user && (
              <>
                <li>
                  <Link to="/user/bloodDonate">LỊCH HẸN CỦA BẠN</Link>
                </li>
                <li>
                  <Link to="/user/history">LỊCH SỬ ĐẶT HẸN</Link>
                </li>
                <li>
                  <Link to="/user/information">HỎI - ĐÁP</Link>
                </li>
                <li>
                  <Link to="/user/news">TIN TỨC</Link>
                </li>
                <li>
                  <Link to="/user/contact">LIÊN HỆ</Link>
                </li>
              </>
            )}
            {!user && (
              <>
                <li>
                  <Link to="/information">HỎI - ĐÁP</Link>
                </li>
                <li>
                  <Link to="/news">TIN TỨC</Link>
                </li>
                <li>
                  <Link to="/contact">LIÊN HỆ</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className={styles.loginArea}>
          {user ? (
            <div className={styles.userDropdown} ref={dropdownRef}>
              <button onClick={toggleDropdown} className={styles.avatarButton}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsVNNgXA9Qlq5GaQtWcqv0eyrFFLBJXWXpnw&s"
                  alt={user?.fullName || "User"}
                  className={styles.avatar}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/32";
                  }}
                />
                <span className={styles.userName}>{user?.username}</span>{" "}
                {/* 👈 Thêm dòng này */}
              </button>

              {showDropdown && (
                <div className={styles.dropdownMenu}>
                  <Link
                    to="/user/profile"
                    className={styles.dropdownItem}
                    onClick={closeDropdown}
                  >
                    Thông tin cá nhân
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={styles.dropdownItem}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button
                onClick={() => navigate("/login")}
                className={`${styles.btn} ${styles.loginBtn}`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className={`${styles.btn} ${styles.registerBtn}`}
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
