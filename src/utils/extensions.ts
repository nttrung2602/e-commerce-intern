import { Modal } from "antd";
import { NavigateFunction } from "react-router-dom";
import { ROUTES } from "../routes/route";

export const requireLoginModal = (
  action: string,
  navigate: any,
  location: any
) => {
  Modal.confirm({
    title: "Bạn chưa đăng nhập",
    content: `Đăng nhập để thực hiện tiếp ${action}`,
    okText: "Đăng nhập",
    cancelText: "Ở lại",
    onOk() {
      navigate(`${ROUTES.LOGIN}`, { state: { from: location } });
    },
    onCancel() {},
  });
};
