import FormLogin from "./../Login/FormLogin";
import { useEffect } from "react";
function Login() {
  useEffect(() => {
    // Cuộn lên đầu trang khi trang này được render
    window.scrollTo(0, 0);
  }, []);
  return <FormLogin></FormLogin>;
}

export default Login;
