import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "../../utils/type";

interface AccountsState {
  accounts: Account[];
}

const initialState: AccountsState = {
  accounts: [],
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    addAccount(state, action: PayloadAction<Account>) {
      const { email } = action.payload;

      // Kiểm tra nếu email đã tồn tại trong danh sách tài khoản
      const accountExists = state.accounts.some(
        (account) => account.email === email
      );

      if (accountExists) {
        // Nếu email đã tồn tại, trả về thông báo
        throw new Error("Email already exists");
      } else {
        // Nếu chưa tồn tại, thêm tài khoản mới vào danh sách
        state.accounts.push(action.payload);
      }
    },
  },
});

export const { addAccount } = accountsSlice.actions;
export default accountsSlice.reducer;
