/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector } from "react-redux";

import LoginCheckModal from "../CheckLogin/ModalCheckLogin/ModalCheckLogin";

const CheckLogin = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  return (
    <div className="rounded-lg shadow-md mb-4 overflow-hidden p-4 w-full mt-10">
      {/* Phần đánh giá của người dùng */}
      <div className="border-b border-[#e5e7eb] mb-5 pb-5">
        <div className="text-center">
          <button
            className="font-medium bg-[#d7000e] text-white border-none rounded-md mx-auto my-2 px-8 py-2 text-center cursor-pointer inline-flex justify-center text-base h-10 leading-6 shadow-none"
            onClick={() => {
              if (!isAuthenticated || user?.role !== "user") {
                setOpenLoginModal(true);
              }
            }}
          >
            Đăng nhập để đánh giá
          </button>
          <LoginCheckModal open={openLoginModal} setOpen={setOpenLoginModal} />
        </div>
      </div>
    </div>
  );
};

export default CheckLogin;
