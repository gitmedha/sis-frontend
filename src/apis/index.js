import axios from "axios";
import { baseURL } from "../constants";

const api = axios.create({
  baseURL,
});

export const setToken = (token) => {
  if (!token) {
    delete api.defaults.headers["Authorization"];
    return;
  }
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
  return;
};

export default api;
