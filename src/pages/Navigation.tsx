import React, { useState } from "react";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

const items: MenuProps["items"] = [
  {
    label: "Home",
    key: "home",
    icon: <HomeOutlined />,
  },

  {
    label: "Mangement",
    key: "management",
    icon: <SettingOutlined />,
    children: [
      {
        key: "/categories",
        label: "Categories",
      },
      {
        key: "/suppliers",
        label: "Suppliers",
      },
      {
        key: "/customers",
        label: "Customers",
      },
      {
        key: "/employees",
        label: "Employees",
      },
      {
        key: "/products",
        label: "Products",
      },
    ],
  },
  {
    label: "Orders",
    key: "orders",
    icon: <HomeOutlined />,
  },
];

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const onMenuClick = (value: any) => {
    navigate(value.key);
    setCurrent(value.key);
  };
  const [current, setCurrent] = useState("category");

  return (
    <Menu
      onClick={onMenuClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Navigation;
