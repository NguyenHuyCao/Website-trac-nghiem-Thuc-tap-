import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/Auth/authSlice";

function FormLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loginLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || "/";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordSpecialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const passwordWhitespaceRegex = /\s/;

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (!passwordSpecialCharRegex.test(formData.password)) {
      newErrors.password =
        "Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*...)";
    } else if (passwordWhitespaceRegex.test(formData.password)) {
      newErrors.password = "Mật khẩu không được chứa khoảng trắng";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      try {
        const result = await dispatch(loginUser(formData)).unwrap();
        console.log("THOONG TIN TRA VE: ", result);
        const role = result.user.role;
        if (role === "admin") {
          window.location.href = "/admin";
        } else {
          navigate(from, { replace: true });
        }
      } catch (err) {
        console.error("Đăng nhập thất bại:", err);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClick = (e) => {
    e.preventDefault();
    window.open("https://laptech4k.onrender.com/auth/google", "_self");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 mt-[-60px]">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Đăng nhập</h2>

          <p className="text-gray-600">
            Chào mừng trở lại! Hãy đăng nhập để tiếp tục
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="flex items-center mt-1">
              <FaEnvelope className="absolute text-gray-400 ml-3" />
              <input
                id="email"
                name="email"
                // type="email"
                tabIndex="1"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email của bạn"
                autoComplete="username"
                className="pl-10 p-3 block w-full border border-gray-300 focus:border-2 focus:border-indigo-500 focus:outline-none rounded-md transition"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="flex items-center mt-1">
              <FaLock className="absolute text-gray-400 ml-3" />
              <input
                id="password"
                name="password"
                tabIndex="2"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                className="pl-10 p-3 block w-full border border-gray-300 focus:border-2 focus:border-indigo-500 focus:outline-none rounded-md transition"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* {error && <p className="text-red-500 text-sm mt-2">{error}</p>} */}

          <div>
            <button
              type="submit"
              disabled={loginLoading}
              className={`w-full py-3 px-4 text-white bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transition transform hover:scale-105 ${
                loginLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <div className="relative mt-2">
              <button
                type="button"
                onClick={handleClick}
                className="flex items-center justify-center w-full py-3 px-4 bg-white border border-gray-300 rounded-lg shadow-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-105"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  className="w-5 h-5 mr-3"
                />
                Đăng nhập bằng Google
              </button>
            </div>
          </div>
        </form>
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FormLogin;
