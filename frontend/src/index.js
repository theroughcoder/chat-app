import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { StoreProvider } from "./Store";
import { HelmetProvider } from "react-helmet-async";
// import { SocketProvider } from "./Socket";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StoreProvider>
  {/* <SocketProvider> */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  {/* </SocketProvider> */}
  </StoreProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
