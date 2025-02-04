import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../routes/route";
import { Avatar, Badge, Button, Drawer, Dropdown } from "antd";
import {
  DownOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { User } from "../axios/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setLoginStatus } from "../slices/auth/loginStatus";

const navMenu = [
  { name: "Trang chủ", href: ROUTES.HOME },
  { name: "Sản phẩm", href: ROUTES.PRODUCT },
  { name: "Tin tức", href: ROUTES.NEWS },
  { name: "Về chúng tôi", href: ROUTES.ABOUT_US },
];

const Header: React.FC = () => {
  const location = useLocation();
  const isLogin = useSelector((state: RootState) => state.login.loginStatus);
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const headerRef = useRef(null);
  const [visibleDrawer, setVisibleDrawer] = useState(false); // Quản lý trạng thái mở/đóng Drawer
  const [visibleHeader, setVisibleHeader] = useState(true); // Quản lý trạng thái mở/đóng Header
  const [lastScrollY, setLastScrollY] = useState(0);

  const user: User = JSON.parse(sessionStorage.getItem("user")!) || null;

  const menuItems = [
    {
      key: "profile",
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: "logout",
      label: (
        <p
          className="w-full cursor-pointer text-red-600"
          onClick={() => {
            sessionStorage.clear();
            dispatch(setLoginStatus("notLoggedIn"));
          }}
        >
          Logout
        </p>
      ),
      danger: true,
    },
  ];

  // Hàm mở Drawer
  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  // Hàm đóng Drawer
  const closeDrawer = () => {
    setVisibleDrawer(false);
  };

  useEffect(() => {
    const handleVisibleHeader = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        // vị trí scroll hiện tại lớn hơn vị trí scroll cũ thì ẨN header
        setVisibleHeader(false);
      } else if (currentScrollY < lastScrollY) {
        setVisibleHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleVisibleHeader);
    return () => {
      window.removeEventListener("scroll", handleVisibleHeader);
    };
  }, [lastScrollY]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-10 bg-gray-200/20 transition-all duration-700	 ${
        visibleHeader ? "translate-y-0 " : "translate-y-[-100%]"
      }`}
    >
      <nav className=" hidden max-w-[1400px] w-full mx-auto  xl:flex flex-row items-center justify-between py-3 md:py-6 ">
        <div>
          <Link to="/">
            <img src="logo-home.png" alt="logo" />
          </Link>
        </div>
        <ul className="flex items-center gap-x-24">
          {navMenu.map((item, index) => (
            <li key={index}>
              <Link
                to={item.href}
                className={`font-semibold ${
                  location.pathname === item.href ? "text-blue-500 " : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {isLogin === "notLoggedIn" ? (
          <div>
            <Link to={ROUTES.REGISTER} className="  py-3 px-7 rounded-full">
              Đăng ký
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="text-white font-semibold bg-black py-3 px-7 rounded-full"
            >
              Đăng nhập
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-x-4">
            <Badge size="default" showZero count={cart.productQuantity}>
              <ShoppingCartOutlined className="text-3xl" />
            </Badge>
            {/* Avatar và Tên người dùng */}
            <Dropdown menu={{ items: menuItems }}>
              <div className="flex items-center cursor-pointer">
                <Avatar
                  src={
                    "https://plus.unsplash.com/premium_photo-1682096252599-e8536cd97d2b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D"
                  }
                  size={40}
                  className="mr-2"
                />
                <span className="font-serif">Hello, {user.name}</span>
                <DownOutlined className="ml-2 text-[6px]" />
              </div>
            </Dropdown>
          </div>
        )}
      </nav>

      {/* Mobile, tablet */}
      <nav className="w-full  text-white xl:hidden">
        {/* Logo và hamburger menu */}
        <div className="flex justify-between items-center py-4 px-6">
          <Link to="/">
            <img src="logo-home.png" alt="logo" className="w-32" />
          </Link>
          <Button
            type="text"
            icon={<MenuOutlined className=" text-2xl" />}
            onClick={showDrawer} // Mở Drawer khi nhấn vào hamburger menu
          />
        </div>

        {/* Drawer menu */}
        <Drawer
          title={
            isLogin === "notLoggedIn" ? (
              <div className="flex flex-col">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-white text-sm font-semibold bg-black py-3 rounded-full text-center"
                >
                  Đăng nhập
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="  py-3 px-7  text-sm rounded-full text-center"
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                {/* Avatar và Tên người dùng */}
                <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                  <div className="flex items-center cursor-pointer">
                    <Avatar
                      src={
                        "https://plus.unsplash.com/premium_photo-1682096252599-e8536cd97d2b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D"
                      }
                      size={40}
                      className="mr-2"
                    />
                    <span className="font-serif">Hello, {user.name}</span>
                    <DownOutlined className="ml-2 text-[6px]" />
                  </div>
                </Dropdown>
              </div>
            )
          }
          placement="left"
          closable={false}
          onClose={closeDrawer}
          open={visibleDrawer}
          width={250}
        >
          {/* Menu links */}
          <ul className="flex flex-col gap-y-8">
            {navMenu.map((item, index) => (
              <li key={index}>
                <Link
                  onClick={closeDrawer}
                  to={item.href}
                  className={`font-semibold ${
                    location.pathname === item.href ? "text-blue-500 " : ""
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </Drawer>
      </nav>
    </header>
  );
};

export default Header;
