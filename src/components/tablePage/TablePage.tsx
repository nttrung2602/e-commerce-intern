import { Card, Table } from "antd";
import React from "react";

const columnsConfig: Record<string, any[]> = {
  dashboard: [
    { title: "Metric", dataIndex: "metric", key: "metric" },
    { title: "Value", dataIndex: "value", key: "value" },
  ],
  users: [
    { title: "Họ và Tên", dataIndex: "name", key: "name" },
    { title: "Tuổi", dataIndex: "age", key: "age" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
  ],
  orders: [
    { title: "Mã Đơn Hàng", dataIndex: "orderId", key: "orderId" },
    { title: "Khách Hàng", dataIndex: "customer", key: "customer" },
    { title: "Tổng Cộng", dataIndex: "total", key: "total" },
  ],
};

const data: Record<string, any[]> = {
  dashboard: [
    { key: "1", metric: "Users", value: "1000" },
    { key: "2", metric: "Orders", value: "500" },
  ],
  users: [
    { key: "1", name: "Nguyễn Văn A", age: 32, address: "Hà Nội" },
    { key: "2", name: "Trần Thị B", age: 28, address: "TP. Hồ Chí Minh" },
  ],
  orders: [
    { key: "1", orderId: "ORD001", customer: "Nguyễn Văn A", total: 500000 },
    { key: "2", orderId: "ORD002", customer: "Trần Thị B", total: 300000 },
  ],
};

const TablePage: React.FC<{ menuKey: string }> = ({ menuKey }) => {
  return (
    <Card title={` ${menuKey.toUpperCase()}`} bordered={false}>
      {<Table dataSource={data[menuKey]} columns={columnsConfig[menuKey]} />}
    </Card>
  );
};

export default TablePage;
