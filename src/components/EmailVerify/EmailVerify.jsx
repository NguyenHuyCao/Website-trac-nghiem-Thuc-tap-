import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `https://quizzlet-19y7.onrender.com/api/v1/user/${param.id}/verify/${param.token}`;
        const { data } = await axios.get(url);
        console.log(data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      {validUrl ? (
        <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md">
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="mx-auto text-green-500 mb-6"
            size="3x"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Email đã xác thực thành công
          </h1>
          <p className="text-gray-600 mb-6">
            Email của bạn đã được xác minh thành công. Bây giờ bạn có thể đăng
            nhập vào tài khoản của mình.
          </p>
          <Link to="/login">
            <button className="px-6 py-3 w-full bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
              Go to Login
            </button>
          </Link>
        </div>
      ) : (
        <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md">
          <svg
            className="w-20 h-20 mx-auto text-red-500 mb-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            404 Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The verification link is invalid or has expired. Please check your
            email or contact support.
          </p>
          <Link to="/">
            <button className="px-6 py-3 w-full bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300">
              Go to Homepage
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmailVerify;
