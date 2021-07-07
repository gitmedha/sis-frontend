import React from "react";
import App from "./App.jsx";
import ReactDOM from "react-dom";
import "./assets/scss/main.scss";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import store from "./store";
import { ToastProvider } from "react-toast-notifications";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
