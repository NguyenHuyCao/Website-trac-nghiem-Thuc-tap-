import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../features/Auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ReCAPTCHA from "react-google-recaptcha";

function FormRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    authType: "local",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState(""); // Lưu token reCAPTCHA

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const whiteSpaceRegex = /\s/;

    if (!formData.username.trim()) {
      newErrors.username = "Tên người dùng không được để trống";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải chứa ít nhất 8 ký tự";
    } else if (!specialCharRegex.test(formData.password)) {
      newErrors.password =
        "Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*...)";
    } else if (whiteSpaceRegex.test(formData.password)) {
      newErrors.password = "Mật khẩu không được chứa khoảng trắng";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Nhập lại mật khẩu không được để trống";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp";
    }
    if (!recaptchaToken) {
      newErrors.recaptcha = "Vui lòng xác minh reCAPTCHA";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      authType: formData.authType,
      recaptchaToken, // Gửi token reCAPTCHA
    };

    try {
      await dispatch(registerUser(userData)).unwrap();
      navigate("/login");
    } catch (error) {
      setErrors({ apiError: "Đăng ký thất bại. Vui lòng thử lại!" });
      console.error("Đăng ký thất bại:", error);
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    setErrors((prevErrors) => ({
      ...prevErrors,
      recaptcha: "",
    }));
  };

  return (
    <div className=" flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 py-12 px-4 sm:px-6 lg:px-8 mt-[-60px]">
      <div className="max-w-xl w-full space-y-6 bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-center text-4xl font-bold text-gray-900">
          Đăng ký
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Tên người dùng */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Tên người dùng
            </label>
            <input
              name="username"
              placeholder="Nhập tên người dùng"
              className="mt-1 p-2 block w-full border rounded-md"
              value={formData.username}
              onChange={handleInputChange}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              name="email"
              placeholder="Nhập email"
              className="mt-1 p-2 block w-full border rounded-md"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Mật khẩu
            </label>
            <input
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              className="mt-1 p-2 block w-full border rounded-md"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Nhập lại mật khẩu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Nhập lại mật khẩu
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="mt-1 p-2 block w-full border rounded-md"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* reCAPTCHA */}
          <div>
            <ReCAPTCHA
              sitekey="6Lda6J0qAAAAAEylOQKpkiy7JcudLvUCBJDnucBT" // Thay YOUR_SITE_KEY bằng sitekey của bạn
              onChange={handleRecaptchaChange}
            />
            {errors.recaptcha && (
              <p className="text-red-500 text-sm">{errors.recaptcha}</p>
            )}
          </div>

          {/* Nút Submit */}
          <div>
            <button
              type="submit"
              disabled={registerLoading}
              className={`w-full py-3 rounded-lg text-white ${
                registerLoading
                  ? "bg-gray-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {registerLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p>
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FormRegister;
