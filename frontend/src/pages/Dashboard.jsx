import React, { useState } from "react";
import GestionDocuments from "../components/Documents";
import GestionProfile from "../components/GestionProfile";
import "../styles/Dashboard.css";

import { Layout, Menu, Breadcrumb, theme, ConfigProvider } from "antd";
import {
   DesktopOutlined,
   FileOutlined,
   PieChartOutlined,
   TeamOutlined,
   UserOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

export default function Dashboard() {
   const [collapsed, setCollapsed] = useState(false);
   const [activeTopMenu, setActiveTopMenu] = useState("1"); // Track top menu selection

   const {
      token: { colorBgContainer, borderRadiusLG },
   } = theme.useToken();

   const siderItems = [
      { key: "1", icon: <PieChartOutlined />, label: "Option 1" },
      { key: "2", icon: <DesktopOutlined />, label: "Option 2" },
      {
         key: "sub1",
         icon: <UserOutlined />,
         label: "User",
         children: [
            { key: "3", label: "Tom" },
            { key: "4", label: "Bill" },
            { key: "5", label: "Alex" },
         ],
      },
      {
         key: "sub2",
         icon: <TeamOutlined />,
         label: "Team",
         children: [
            { key: "6", label: "Team 1" },
            { key: "8", label: "Team 2" },
         ],
      },
      { key: "9", icon: <FileOutlined />, label: "Files" },
   ];

   return (
      <ConfigProvider
         theme={{
            token: {
               colorPrimary: "#31c1e1",
               borderRadius: 20,
            },
         }}
      >
         <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
               <div className="demo-logo-vertical" />
               <Menu
                  theme="dark"
                  defaultSelectedKeys={["1"]}
                  mode="inline"
                  items={siderItems}
               />
            </Sider>

            <Layout>
               <Header
                  style={{ background: colorBgContainer, padding: "0 16px" }}
               >
                  <Menu
                     mode="horizontal"
                     selectedKeys={[activeTopMenu]}
                     onClick={(e) => setActiveTopMenu(e.key)}
                  >
                     <Menu.Item key="1">Accueil</Menu.Item>
                     <Menu.Item key="2">Documents</Menu.Item>
                     <Menu.Item key="3">Profil</Menu.Item>
                  </Menu>
               </Header>

               <Content style={{ margin: "0 16px" }}>
                  <Breadcrumb
                     style={{ margin: "16px 0" }}
                     items={[
                        {
                           title:
                              activeTopMenu === "2" ? "Documents" : "Accueil",
                        },
                     ]}
                  />
                  <div
                     style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                     }}
                  >
                     {activeTopMenu === "2" && <GestionDocuments />}
                     {activeTopMenu === "1" && (
                        <div>Welcome to the dashboard!</div>
                     )}
                     {activeTopMenu === "3" && <GestionProfile />}
                  </div>
               </Content>
            </Layout>
         </Layout>
      </ConfigProvider>
   );
}
