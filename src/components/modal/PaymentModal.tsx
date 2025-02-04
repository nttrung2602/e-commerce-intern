import React, { useEffect } from "react";
import { Button, message, Modal } from "antd";
import { BANK_API_KEY, paymentService } from "../../axios/paymentService";
import axios from "axios";

// const API_KEY = import.meta.env.VITE_BANK_API_KEY;

interface PaymentInfo {
  id: string;
  quantity: number;
  price: number;
}

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  paymentInfo: PaymentInfo;
}

const myBankAccount = {
  BANK_ID: "Vietcombank",
  ACCOUNT_NO: "0231000685398",
  ACCOUNT_NAME: "NGUYEN THANH TRUNG",
};

const PaymentModal: React.FC<Props> = ({ isOpen, onCancel, paymentInfo }) => {
  const transactionId = (
    paymentInfo.id.substring(paymentInfo.id.length / 2) + Date.now()
  ).replace(/\-/g, "");

  useEffect(() => {
    // check liên tục api trả về lịch sử giao dịch ngân hàng
    const checkTransactionList = setInterval(async () => {
      const res = await paymentService.getBankTransactionHistory();
      const data = res.data.data;
      console.log("data", data);
      const fiveTransactionRecent = data.records.slice(-10);
      fiveTransactionRecent.forEach(async (transaction: any) => {
        console.log("transaction", transaction);
        console.log("============================================");

        if (
          transaction.amount == paymentInfo.price &&
          transaction.description.includes(transactionId)
        ) {
          const res = await paymentService.createNewPurchase(
            paymentInfo.id,
            paymentInfo.quantity
          );
          console.log(res);
          message.success("Thanh toán thành công!");
          onCancel();
        }
      });
    }, 5000);
    return () => {
      clearInterval(checkTransactionList);
    };
  }, []);

  return (
    <Modal
      maskClosable={false}
      closable={false}
      open={isOpen}
      footer={
        <div className="flex justify-center">
          <Button
            onClick={() => {
              onCancel();
              message.error("Thanh toán không thành công!");
            }}
            className="font-semibold"
          >
            HỦY THANH TOÁN
          </Button>
        </div>
      }
    >
      <img
        src={`https://img.vietqr.io/image/${myBankAccount.BANK_ID}-${myBankAccount.ACCOUNT_NO}-compact2.png?amount=${paymentInfo.price}&addInfo=${transactionId}&accountName=${myBankAccount.ACCOUNT_NAME}`}
      />
    </Modal>
  );
};

export default PaymentModal;
