export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RoleResponse {
  role: string;
}

export interface User{
  role: string;
  email: string;
  name: string;
  address: string;
}
