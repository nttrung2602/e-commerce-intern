import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes/route";

const ProtectedRoute: React.FC = () => {
  const token = sessionStorage.getItem("access_token");
  const location = useLocation();

  if (!token) {
    // Chuyển hướng đến Login và lưu URL hiện tại trong state
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
