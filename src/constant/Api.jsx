import axios from "axios";
import { baseURL } from "./BaseUrl";

export default axios.create({
  baseURL: `${baseURL}`,
  timeout: 1000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});