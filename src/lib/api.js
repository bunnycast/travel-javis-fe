// frontend/src/lib/api.js
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // 프로덕션에서 https://javis.shop/api
    withCredentials: false, // 토큰을 헤더로 보낼 것이므로 false
});

// 요청마다 Authorization 자동 첨부
api.interceptors.request.use((config) => {
    const t = localStorage.getItem("accessToken");
    if (t) config.headers["Authorization"] = `Bearer ${t}`;
    return config;
});
