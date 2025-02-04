import axios from "axios";
import authService from "./authService";
import { ROUTES } from "../routes/route";

const axiosClient = axios.create({
  baseURL: "http://localhost:8070",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const token = sessionStorage.getItem("access_token");

    const unauthAPIRoutes = [`${ROUTES.LOGIN}`, `${ROUTES.REGISTER}`];

    if (
      token &&
      !unauthAPIRoutes.some((route) => config.url?.startsWith(route))
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Do something with request error

    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    originalRequest._retry = false;

    // Kiểm tra lỗi 401 và tránh lặp vô hạn
    if (
      error.response?.status === 401 &&
      originalRequest.url !== ROUTES.LOGIN &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Đánh dấu request đã thử refresh
      try {
        // Gọi API refresh token
        const refreshTokenReponse = await authService.refreshToken();
        sessionStorage.setItem(
          "access_token",
          refreshTokenReponse.data.accessToken
        );
        sessionStorage.setItem(
          "refesh_token",
          refreshTokenReponse.data.refreshToken
        );
        // Cập nhật header Authorization của request cũ
        originalRequest.headers.Authorization = `Bearer ${refreshTokenReponse.data.accessToken}`;

        // Gửi lại request cũ với token mới
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Xử lý khi refresh token thất bại
        console.error("Failed to refresh token:", refreshError);

        sessionStorage.clear();

        window.location.href = `${ROUTES.LOGIN}`; // Chuyển hướng về trang đăng nhập
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
