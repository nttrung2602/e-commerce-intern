import { API_ROUTES } from "../routes/route";
import axiosClient from "./axiosClient";
import { LoginRequest, TokenResponse } from "./types";

const authService = {
  login(data: LoginRequest) {
    return axiosClient.post<TokenResponse>(API_ROUTES.LOGIN, data);
  },

  refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      return Promise.reject(new Error("No refresh token available"));
    }

    return axiosClient.post<TokenResponse>(API_ROUTES.REFRESH_TOKEN, {
      refresh_token: refreshToken,
    }); // Trả về token mới
  },
};

export default authService;
