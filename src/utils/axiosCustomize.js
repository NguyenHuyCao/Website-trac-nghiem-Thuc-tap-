import axios from "axios";
import Nprogress from "nprogress";
import "nprogress/nprogress.css"; // Import CSS cho Nprogress

// Cấu hình Nprogress
Nprogress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

// Tạo instance Axios
const instance = axios.create({
  baseURL: "https://quizzlet-19y7.onrender.com/", // Kiểm tra baseURL
});

// Interceptor cho request
instance.interceptors.request.use(
  (config) => {
    Nprogress.start();
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
    // Kiểm tra nếu response chứa `message` hoặc `quiz`
    if (response.data?.message) {
      console.log(response.data.message); // Log thông báo để xác nhận
    }
    console.log(response.data);

    return response.data || response; // Trả về dữ liệu đầy đủ
  },
  (error) => {
    Nprogress.done();
    console.error("Response error:", error); // Log lỗi response
    return Promise.reject(
      error?.response?.data?.message || error // Trả về message hoặc reject lỗi
    );
  }
);

export default instance;
