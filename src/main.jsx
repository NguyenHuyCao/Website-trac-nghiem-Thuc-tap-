// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router";
// import Layout from "./Layout.jsx";
// import { Provider } from "react-redux";
// import { store } from "./stores/store.js"; // Đảm bảo bạn đã tạo store
// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <BrowserRouter>
//       <Layout />
//     </BrowserRouter>
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout.jsx";
import { Provider } from "react-redux";
import { store } from "./stores/store.js";
import "./assets/css/style.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
