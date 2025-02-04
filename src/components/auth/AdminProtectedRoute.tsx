import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/route";
import { Modal } from "antd";
import { User } from "../../axios/types";

const AdminProtectedRoute = () => {
  const user: User = JSON.parse(sessionStorage.getItem("user")!);
  const role = user.role;

  const navigate = useNavigate();
  const [isUnauthorizedAdmin, setUnauthorizedAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (role !== "ADMIN") {
      setUnauthorizedAdmin(true);
    }
  }, []);

  if (role !== "ADMIN") {
    return (
      <Modal
        title="Thông báo"
        open={isUnauthorizedAdmin}
        onOk={() => {
          navigate(ROUTES.PRODUCT);
        }}
        cancelButtonProps={{ style: { display: "none" } }} // Ẩn nút Cancel
        closable={false}
      >
        You don't have permissions to access this page
      </Modal>
    );
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
