import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./Header.scss";
import Logo from "../../../assets/Logo.png";
import { Layout } from "antd";
const { Header } = Layout;

const AppHeader = () => {
  return (
    <header className="header">
      {/* Top header */}
      <div className="top-header">
        {/* Logo */}
        <div className="logo-container">
          <img src={Logo} alt="logo" className="logo" />
        </div>
        <nav className="navbar">
          <ul className="nav-list">
            <li>
              <Link to="/">TRANG CHỦ</Link>
            </li>
            <li>
              <Link to="/faq">HỎI - ĐÁP</Link>
            </li>
            <li>
              <Link to="/news">TIN TỨC</Link>
            </li>
            <li>
              <Link to="/contact">LIÊN HỆ</Link>
            </li>
          </ul>
        </nav>

        {/* Đăng nhập */}
        <div className="login-link">
          <Link to="/login">
            <FaUser className="login-icon" />
            <span>Đăng nhập</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
