import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const http = axios.create({
  baseURL: API,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export const fetchPosts = (params = {}) => http.get("/posts", { params }).then((r) => r.data);
export const fetchFeatured = () => http.get("/posts/featured").then((r) => r.data);
export const fetchEditorsPicks = () =>
  http.get("/posts", { params: { editorsPick: true } }).then((r) => r.data);
export const subscribeEmail = (email) => http.post("/subscribe", { email }).then((r) => r.data);
export const sendContact = (payload) => http.post("/contact", payload).then((r) => r.data);
