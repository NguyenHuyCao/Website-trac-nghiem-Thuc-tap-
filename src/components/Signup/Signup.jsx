import FormRegister from "./FormRegister";
import { useEffect } from "react";

function Signup() {
  useEffect(() => {
    // Cuộn lên đầu trang khi trang này được render
    window.scrollTo(0, 0);
  }, []);
  return <FormRegister></FormRegister>;
}

export default Signup;
