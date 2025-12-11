import React from "react";
import { Menu, Layout } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

const NavBar = () => {
  const location = useLocation(); // pour détecter la route active
  const selectedKey = () => {
    switch (location.pathname) {
      case "/": return "1";
      case "/documents": return "2";
      case "/profil": return "3";
      default: return "1";
    }
  };

  return (
    <Header>
      <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey()]}>
        <Menu.Item key="1">
          <Link to="/">Accueil</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/documents">Documents</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/profil">Profil</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default NavBar;
