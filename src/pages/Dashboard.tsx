import {
  Breadcrumb,
  Button,
  Divider,
  Drawer,
  Layout,
  Menu,
  message,
} from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MenuOutlined, PoweroffOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ROUTES } from "../routes/route";
import { useDispatch } from "react-redux";
import { setLoginStatus } from "../slices/auth/loginStatus";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuKey = location.pathname;

  const [visible, setVisible] = useState(false);
  const showDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);

  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment.length > 0);

  // Đặt tên breadcrumb từ các phần của đường dẫn
  const breadcrumbItems = pathSegments.map((segment, _) => {
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
    };
  });

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      dispatch(setLoginStatus("notLoggedIn"));

      message.warning("Logged out!");

      sessionStorage.clear();

      navigate(ROUTES.LOGIN); // Xử lý log out
    } else {
      navigate(`${key}`);
      closeDrawer(); // Đóng Drawer khi chọn item
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsible
        collapsedWidth={0}
        theme="dark"
        trigger={null}
      >
        <div
          className="logo"
          style={{
            height: "32px",
            margin: "16px",
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <Menu
          theme="dark"
          selectedKeys={[menuKey]}
          defaultSelectedKeys={["dashboard"]}
          mode="inline"
          onClick={handleMenuClick}
        >
          <Menu.Item key={ROUTES.PRODUCTS_DASHBOARD}>Products</Menu.Item>
          <Menu.Item key={ROUTES.CATEGORIES}>Categories</Menu.Item>
          <Divider style={{ margin: "12px 0", backgroundColor: "white" }} />
          <Menu.Item
            key="logout"
            style={{ marginTop: "auto", color: "#ff4d4f" }}
            icon={<PoweroffOutlined />}
          >
            <span style={{ color: "#ff4d4f" }}>Log Out</span>
          </Menu.Item>
        </Menu>
      </Sider>

      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        open={visible}
        width="250px"
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[menuKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key={ROUTES.PRODUCTS_DASHBOARD}>Products</Menu.Item>
          <Menu.Item key={ROUTES.CATEGORIES}>Categories</Menu.Item>
          <Divider style={{ margin: "12px 0", backgroundColor: "white" }} />
          <Menu.Item
            key="logout"
            style={{ marginTop: "auto", color: "#ff4d4f" }}
            icon={<PoweroffOutlined />}
          >
            <span style={{ color: "#ff4d4f" }}>Log Out</span>
          </Menu.Item>
        </Menu>
      </Drawer>
      <Layout>
        <Header className="px-4 bg-[#fff] flex ">
          {/* Mở Drawer khi responsive */}
          <Button
            className=" menu-trigger visible lg:hidden my-4 ml-auto"
            type="primary"
            onClick={showDrawer}
          >
            <MenuOutlined />
          </Button>
        </Header>
        <Content className="m-0 md:m-[16px]">
          <Breadcrumb className="my-[16px] ml-[24px] md:ml-0">
            {breadcrumbItems.map((item, index) => (
              <Breadcrumb.Item key={index}>{item.label}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div className="min-h-[360px] p-0 pt-4 md:p-[24px] bg-white">
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
