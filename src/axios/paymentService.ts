import axios from "axios";
import axiosClient from "./axiosClient";
import { API_ROUTES } from "../routes/route";

export const BANK_API_KEY = import.meta.env.VITE_BANK_API_KEY;

export const paymentService = {
  getBankTransactionHistory() {
    return axios.get(`${API_ROUTES.CHECK_MY_BANK_HISTORY}?pageSize=20`, {
      headers: {
        Authorization: `Apikey ${BANK_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
  },
  createNewPurchase(productId: string, quantity: number) {
    return axiosClient.post(`${API_ROUTES.CREATE_NEW_PURCHASE}`, {
      productId,
      amount: quantity,
    });
  },
};
