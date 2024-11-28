import "./Header.scss";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { BsPersonWorkspace } from "react-icons/bs";
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
              to="/add-quiz"
              className={`nav-link ${currentPage === 1 && `active`}`}
            >
              <IoMdAddCircleOutline className="nav-icon" />
              Thêm bài thi
            </Link>
          </li>
          <li className="nav-item" onClick={() => setCurrentPage(2)}>
            <Link
              to="/exam"
              className={`nav-link ${currentPage === 2 && `active`}`}
            >
              <BsPersonWorkspace className="nav-icon" />
              Làm bài thi
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
