import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./Header.scss";
import Logo from "../../../assets/Logo.png";
import { Layout } from "antd";
import { useAuth } from "../../../hooks/AuthContext"; // import hook

const { Header } = Layout;

const AppHeader = () => {
  const { user, logout } = useAuth(); // lấy trạng thái đăng nhập
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // quay lại trang chủ sau khi logout
  };

  return (
    <header className="header">
      <div className="top-header">
        <div className="logo-container">
          <img src={Logo} alt="logo" className="logo" />
        </div>
        <nav className="navbar">
          <ul className="nav-list">
            <li>
              <Link to="/">TRANG CHỦ</Link>
            </li>
            <li>
              <Link to="/information">HỎI - ĐÁP</Link>
            </li>
            <li>
              <Link to="/news">TIN TỨC</Link>
            </li>
            {user ? (
              <li>
                <Link to="/profile">THÔNG TIN NGƯỜI DÙNG</Link>
              </li>
            ) : (
              <li>
                <Link to="/contact">LIÊN HỆ</Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Đăng nhập / Đăng xuất */}
        <div className="login-link">
          {user ? (
            <button onClick={handleLogout} className="logout-button">
              <FaUser className="login-icon" />
              <span>Đăng xuất</span>
            </button>
          ) : (
            <Link to="/login">
              <FaUser className="login-icon" />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
