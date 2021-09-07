import axios from "axios";
import { baseURL } from "../constants";

const api = axios.create({
  baseURL,
});

// Add a request interceptor
api.interceptors.request.use(function (config) {
  // Do something before request is sent
  console.log('api config', config);
  if (config.url === '/graphql') {
    let token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

export const setToken = (token) => {
  if (!token) {
    delete api.defaults.headers["Authorization"];
    return;
  }
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
  return;
};

export const queryBuilder = async (params) => {
  try {
    let { data } = await api.post("/graphql", {
      ...params,
    });
    return data;
  } catch (err) {
    console.log("ERR", err);
    throw err;
  }
};

export default api;
