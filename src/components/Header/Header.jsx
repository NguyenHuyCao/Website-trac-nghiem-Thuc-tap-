import "./Header.scss";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiSlideshowView } from "react-icons/ri";
import { useState, useEffect } from "react";
import AuthButtons from "./AuthButtons/AuthButtons";
import { useSelector } from "react-redux";
import LoginCheckModal from "../CheckLogin/ModalCheckLogin/ModalCheckLogin";

const Header = () => {
  // Lấy giá trị từ localStorage, nếu không có thì mặc định là 0
  const initialPage = Number(localStorage.getItem("currentPage")) || 0;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const handleProtectedRoute = (e, route, requireAuth = false) => {
    if (requireAuth && (!isAuthenticated || user?.role !== "user")) {
      e.preventDefault(); // Chặn hành động mặc định của Link
      setOpenLoginModal(true); // Mở modal thông báo
    } else {
      setCurrentPage(route); // Cập nhật trạng thái trang hiện tại
      localStorage.setItem("currentPage", route); // Lưu vào localStorage
    }
  };

  useEffect(() => {
    // Đồng bộ trạng thái trang khi component render
    setCurrentPage(initialPage);
  }, [initialPage]);

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list flex justify-between w-full">
          {/* Phần bên trái */}
          <div className="flex space-x-4">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${currentPage === 0 && `active`}`}
                onClick={(e) => handleProtectedRoute(e, 0)}
              >
                <FaHome className="nav-icon" />
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/show-quiz"
                className={`nav-link ${currentPage === 1 && `active`}`}
                onClick={(e) => handleProtectedRoute(e, 1, true)}
              >
                <RiSlideshowView className="nav-icon" />
                Bài thi
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/add-quiz"
                className={`nav-link ${currentPage === 2 && `active`}`}
                onClick={(e) => handleProtectedRoute(e, 2, true)} // Yêu cầu đăng nhập
              >
                <IoMdAddCircleOutline className="nav-icon" />
                Thêm bài thi
              </Link>
            </li>
          </div>

          {/* Phần bên phải */}
          <li className="nav-item">
            <AuthButtons />
          </li>
        </ul>
      </nav>

      {/* Modal thông báo đăng nhập */}
      <LoginCheckModal open={openLoginModal} setOpen={setOpenLoginModal} />
    </header>
  );
};

export default Header;
