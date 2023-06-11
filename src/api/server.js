import axios from "axios";

import { baseUrl } from "./constants";

const PROTOCOL = process.env.SSL ? "https" : "http";
const PATH = process.env.API_PATH ? `/${process.env.API_PATH}` : "";
const API = process.env.API
  ? `${PROTOCOL}://${process.env.API}${PATH}/`
  : baseUrl;

const API_PATH = API || (PATH ? `${PATH}/` : "");

const server = axios.create({
  baseURL: API_PATH,
  mode: "cors",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const multipartServer = axios.create({
  baseURL: API_PATH,
  mode: "cors",
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
});

server.interceptors.response.use((response) => response.data);

multipartServer.interceptors.response.use((response) => response.data);

export default server;
