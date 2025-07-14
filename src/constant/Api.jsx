import axios from "axios";
import { baseURL } from "./BaseUrl";

export default axios.create({
  baseURL: `${baseURL}`,
  timeout: 1000,
  withCredentials: false, // Changed to false to avoid CORS issues with wildcard origins
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});