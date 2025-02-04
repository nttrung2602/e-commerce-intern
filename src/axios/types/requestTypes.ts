import { Product } from ".";

// Kiểu dữ liệu cho request khi đăng nhập
export interface LoginRequest {
  email: string;
  password: string;
}

// Kiểu dữ liệu cho request khi đăng ký người dùng
export interface RegisterUserRequest {
  email: string;
  name: string;
  address: string;
  password: string;
}


