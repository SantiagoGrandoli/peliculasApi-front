import axios from "axios";

const base = axios.create({
  baseURL: "https://localhost:7051/api",
  withCredentials: true,
});

export default base;
