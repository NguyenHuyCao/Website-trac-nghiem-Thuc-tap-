import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import "./App.scss";
// import ModalNotification from "./components/Modal/Notification";

const App = () => (
  <>
    <div className="header">
      <Header />
    </div>
    <div className="container">
      <Outlet />
    </div>
    {/* <ModalNotification /> */}
  </>
);

export default App;
