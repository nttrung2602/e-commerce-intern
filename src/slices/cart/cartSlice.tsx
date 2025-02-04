import { createSlice } from "@reduxjs/toolkit";

export interface CartState {
  productQuantity: number;
}

const initialState: CartState = {
  productQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state) {
      state.productQuantity += 1;
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
