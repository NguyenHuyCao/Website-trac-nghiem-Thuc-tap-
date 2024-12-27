// import axios from "axios";
// import Nprogress from "nprogress";
// import "nprogress/nprogress.css"; // Import CSS cho Nprogress

// // Cấu hình Nprogress
// Nprogress.configure({
//   showSpinner: false,
//   trickleSpeed: 100,
// });

// // Tạo instance Axios
// const instance = axios.create({
//   baseURL: "https://quizzlet-19y7.onrender.com/", // Kiểm tra baseURL
// });

// // Interceptor cho request
// instance.interceptors.request.use(
//   (config) => {
//     Nprogress.start();
//     return config;
//   },
//   (error) => {
//     Nprogress.done();
//     console.error("Request error:", error); // Log lỗi request
//     return Promise.reject(error);
//   }
// );

// // Interceptor cho response
// instance.interceptors.response.use(
//   (response) => {
//     Nprogress.done();
//     // Kiểm tra nếu response chứa `message` hoặc `quiz`
//     // if (response.data?.message) {
//     //   console.log(response.data.message); // Log thông báo để xác nhận
//     // }
//     // console.log(response.data);

//     return response.data || response; // Trả về dữ liệu đầy đủ
//   },
//   (error) => {
//     Nprogress.done();
//     console.error("Response error:", error); // Log lỗi response
//     return Promise.reject(
//       error?.response?.data?.message || error // Trả về message hoặc reject lỗi
//     );
//   }
// );

// export default instance;

import axios from "axios";
import Nprogress from "nprogress";
import "nprogress/nprogress.css"; // Import CSS cho Nprogress
import { toast } from "react-toastify";

// Cấu hình Nprogress
Nprogress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

// Tạo instance Axios
const instance = axios.create({
  // baseURL: "https://quizzlet-19y7.onrender.com/", // Kiểm tra baseURL
  baseURL: "https://quizzlet-19y7.onrender.com/", // Kiểm tra baseURL
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho request
instance.interceptors.request.use(
  (config) => {
    Nprogress.start();

    // Lấy token từ localStorage và thêm vào header Authorization nếu có
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    Nprogress.done();
    console.error("Request error:", error); // Log lỗi request
    return Promise.reject(error);
  }
);

// Interceptor cho response
instance.interceptors.response.use(
  (response) => {
    Nprogress.done();
    return response.data || response; // Trả về dữ liệu đầy đủ
  },
  (error) => {
    Nprogress.done();
    console.error("Response error:", error); // Log lỗi response

    if (error.response && error.response.status === 401) {
      localStorage.clear();
      // Hiển thị thông báo lỗi nếu token hết hạn
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");

      setTimeout(() => {
        window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
      }, 1000);
    } else {
      toast.error(error?.response?.data?.message || "Đã xảy ra lỗi");
    }

    return Promise.reject(error?.response?.data?.message || error); // Trả về message lỗi hoặc reject lỗi
  }
);

export default instance;
