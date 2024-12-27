/* eslint-disable react/prop-types */
import { Modal, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const LoginCheckModal = ({ open, setOpen }) => {
  const location = useLocation();
  const handleCloseLoginModal = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleCloseLoginModal}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "24rem",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "0.5rem",
        }}
        className="text-center"
      >
        {/* Nút đóng */}
        <button
          onClick={handleCloseLoginModal}
          className="absolute top-2 right-4 text-gray-600 text-2xl font-bold cursor-pointer focus:outline-none"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Nội dung Modal */}
        <img
          src="https://themewagon.com/wp-content/uploads/2021/03/Frame-172-1.png" // Thay thế bằng đường dẫn hình ảnh của bạn
          alt="Logo"
          className="w-20 mx-auto"
        />
        <p
          id="login-modal-description"
          className="text-base mt-4 text-gray-700"
        >
          Vui lòng đăng nhập tài khoản để sử dụng .
        </p>

        {/* Nút hành động */}
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-4 py-2 border border-red-600 text-red-600 font-medium rounded focus:outline-none hover:bg-red-50"
          >
            Đăng ký
          </Link>
          <Link
            to="/login"
            state={{ from: location }}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded focus:outline-none hover:bg-red-700"
            // onClick={handleProductID}
          >
            Đăng nhập
          </Link>
        </div>
      </Box>
    </Modal>
  );
};

export default LoginCheckModal;
