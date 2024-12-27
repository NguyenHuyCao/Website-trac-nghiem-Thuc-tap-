import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import { ToastContainer } from "react-toastify";
// import "./App.scss";

const App = () => (
  <>
    {/* <div className="header"> */}
    <ToastContainer />
    <Header />
    {/* </div> */}
    {/* <div className="container"> */}
    <Outlet />
    {/* </div> */}
  </>
);

export default App;
