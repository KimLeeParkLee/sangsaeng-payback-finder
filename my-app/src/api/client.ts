import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// 요청/응답 인터셉터 예시
api.interceptors.request.use((config) => {
  // 토큰 붙이기 등
  // const token = localStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // 에러 공통 처리
    return Promise.reject(error);
  },
);
