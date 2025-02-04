import { Outlet } from "react-router-dom";
import Header from "./Header";

const HomeLayout = () => {
  return (
    <div className="w-full">
      <Header />
      <Outlet />
    </div>
  );
};

export default HomeLayout;
