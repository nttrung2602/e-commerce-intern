import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "../slices/registers/registerSlice";
import loginReducer from "../slices/auth/loginStatus";
import cartReducer from "../slices/cart/cartSlice";
export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    login: loginReducer,
    cart: cartReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
