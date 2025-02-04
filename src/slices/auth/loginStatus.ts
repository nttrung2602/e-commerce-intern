import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../axios/types";

export interface LoginState {
  loginStatus: "loggedIn" | "notLoggedIn";
}

const initialState: LoginState = {
  loginStatus: "notLoggedIn",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginStatus(state, action: PayloadAction<"loggedIn" | "notLoggedIn">) {
      state.loginStatus = action.payload;
    },
  },
});

export const { setLoginStatus } = loginSlice.actions;
export default loginSlice.reducer;
