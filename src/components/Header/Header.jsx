import "./Header.scss";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
// import { BsPersonWorkspace } from "react-icons/bs";
import { RiSlideshowView } from "react-icons/ri";
import { useState } from "react";

const Header = () => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item" onClick={() => setCurrentPage(0)}>
            <Link
              to="/"
              className={`nav-link ${currentPage === 0 && `active`}`}
            >
              <FaHome className="nav-icon" />
              Trang chủ
            </Link>
          </li>
          <li className="nav-item" onClick={() => setCurrentPage(1)}>
            <Link
              to="/show-quiz"
              className={`nav-link ${currentPage === 1 && `active`}`}
            >
              <RiSlideshowView className="nav-icon" />
              Bài thi
            </Link>
          </li>
          <li className="nav-item" onClick={() => setCurrentPage(2)}>
            <Link
              to="/add-quiz"
              className={`nav-link ${currentPage === 2 && `active`}`}
            >
              <IoMdAddCircleOutline className="nav-icon" />
              Thêm bài thi
            </Link>
          </li>

          {/* <li className="nav-item" onClick={() => setCurrentPage(3)}>
            <Link
              to="/exam"
              className={`nav-link ${currentPage === 3 && `active`}`}
            >
              <BsPersonWorkspace className="nav-icon" />
              Làm bài
            </Link>
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
