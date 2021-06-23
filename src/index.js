import React from "react";
import App from "./App1.jsx";
import ReactDOM from "react-dom";
import "./assets/scss/main.scss";
import "rsuite/dist/styles/rsuite-default.css";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
