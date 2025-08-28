import React, { useState } from "react";
import "./App.css";
import "antd/dist/reset.css";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import GestionDocuments from "./pages/Documents";

const { Header, Content, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const siderItems = [
    { key: "1", icon: <PieChartOutlined />, label: "Option 1" },
    { key: "2", icon: <DesktopOutlined />, label: "Option 2" },
    { key: "sub1", icon: <UserOutlined />, label: "User", children: [
      { key: "3", label: "Tom" },
      { key: "4", label: "Bill" },
      { key: "5", label: "Alex" },
    ]},
    { key: "sub2", icon: <TeamOutlined />, label: "Team", children: [
      { key: "6", label: "Team 1" },
      { key: "8", label: "Team 2" },
    ]},
    { key: "9", icon: <FileOutlined />, label: "Files" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sider */}
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={siderItems} />
      </Sider>

      {/* Layout principal */}
      <Layout>
        {/* NavBar statique */}
        <Header style={{ background: colorBgContainer, padding: "0 16px" }}>
          <Menu mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">Accueil</Menu.Item>
            <Menu.Item key="2">Documents</Menu.Item>
            <Menu.Item key="3">Profil</Menu.Item>
          </Menu>
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} items={[{ title: "Documents" }]} />
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
            <GestionDocuments />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
