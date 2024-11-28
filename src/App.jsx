import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import "./App.scss";

const App = () => (
  <>
    <div className="header">
      <Header />
    </div>
    <div className="container">
      <Outlet />
    </div>
  </>
);

export default App;
