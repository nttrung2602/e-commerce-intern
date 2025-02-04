import { API_ROUTES } from "../routes/route";
import axiosClient from "./axiosClient";
import { RegisterUserRequest, RoleResponse, User } from "./types";

const userService = {
  addUser(data: RegisterUserRequest) {
    return axiosClient.post(API_ROUTES.ADD_USER, data);
  },
  // checkRole() {
  //   return axiosClient.get<RoleResponse>(API_ROUTES.CHECK_ROLE);
  // },
  userProfile() {
    return axiosClient.get<User>(API_ROUTES.USER_PROFILE);
  },
};

export default userService;
