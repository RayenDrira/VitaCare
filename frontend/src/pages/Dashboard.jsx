import React, { useState } from "react";
import GestionDocuments from "../components/Documents";
import GestionProfile from "../components/GestionProfile";
import "../styles/Dashboard.css";
import Logo from "../assets/VitaCare_logo.png";

import {
   Layout,
   Menu,
   ConfigProvider,
   Card,
   Typography,
   Badge,
   Avatar,
   Dropdown,
   Button,
   Space,
} from "antd";
import {
   DashboardOutlined,
   FileTextOutlined,
   UserOutlined,
   BarChartOutlined,
   SettingOutlined,
   BellOutlined,
   SearchOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function Dashboard() {
   const [collapsed, setCollapsed] = useState(false);
   const [activePage, setActivePage] = useState("1");

   const siderItems = [
      {
         key: "1",
         icon: <DashboardOutlined style={{ fontSize: "18px" }} />,
         label: "Dashboard",
         style: { margin: "8px 0", borderRadius: "12px" },
      },
      {
         key: "2",
         icon: <BarChartOutlined style={{ fontSize: "18px" }} />,
         label: "Analytics",
         style: { margin: "8px 0", borderRadius: "12px" },
      },

      {
         key: "9",
         icon: <FileTextOutlined style={{ fontSize: "18px" }} />,
         label: "Documents",
         style: { margin: "8px 0", borderRadius: "12px" },
      },
      {
         key: "10",
         icon: <UserOutlined style={{ fontSize: "18px" }} />,
         label: "Profil",
         style: { margin: "8px 0", borderRadius: "12px" },
      },
   ];

   const userMenu = (
      <Menu
         style={{ borderRadius: "12px", padding: "8px" }}
         onClick={(e) => {
            if (e.key === "10") {
               setActivePage("10"); // Go to Profile
            }
            if (e.key === "logout") {
               console.log("Déconnexion...");
               localStorage.removeItem("jwt");

               window.location.href = "/login";
            }
         }}
      >
         <Menu.Item key="10" icon={<UserOutlined />}>
            Mon Profil
         </Menu.Item>
         <Menu.Item key="settings" icon={<SettingOutlined />}>
            Paramètres
         </Menu.Item>
         <Menu.Divider />
         <Menu.Item key="logout" style={{ color: "#ff4d4f" }}>
            Déconnexion
         </Menu.Item>
      </Menu>
   );

   return (
      <ConfigProvider
         theme={{
            token: {
               colorPrimary: "#6366f1",
               colorBgContainer: "#ffffff",
               colorBgElevated: "#ffffff",
               borderRadius: 16,
               boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
               fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            },
            components: {
               Menu: {
                  itemBg: "transparent",
                  itemSelectedBg: "rgba(99, 102, 241, 0.1)",
                  itemSelectedColor: "#6366f1",
                  itemHoverBg: "rgba(99, 102, 241, 0.05)",
                  subMenuItemBg: "transparent",
               },
               Layout: {
                  siderBg: "#1a1b23",
                  headerBg: "#ffffff",
               },
            },
         }}
      >
         <Layout style={{ minHeight: "100vh", background: "#f8fafc" }}>
            {/* Sidebar */}
            <Sider
               collapsible
               collapsed={collapsed}
               onCollapse={setCollapsed}
               width={280}
               collapsedWidth={80}
               style={{
                  background:
                     "linear-gradient(135deg, #1a1b23 0%, #2d2e3f 100%)",
                  borderRadius: collapsed ? "0 24px 24px 0" : "0 32px 32px 0",
                  boxShadow: "8px 0 32px rgba(0,0,0,0.12)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
               }}
            >
               <div
                  style={{
                     height: 80,
                     margin: "24px 16px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: collapsed ? "center" : "flex-start",
                     background: "rgba(255, 255, 255, 0.05)",
                     borderRadius: "20px",
                     backdropFilter: "blur(10px)",
                     border: "1px solid rgba(255, 255, 255, 0.1)",
                     padding: "0 16px",
                     transition: "all 0.3s ease",
                  }}
               >
                  <img
                     src={Logo}
                     style={{
                        width: collapsed ? 32 : 40,
                        height: collapsed ? 32 : 40,
                        transition: "all 0.3s ease",
                     }}
                     alt="VitaCare"
                  />
                  {!collapsed && (
                     <div style={{ marginLeft: 16 }}>
                        <Text
                           style={{
                              color: "#ffffff",
                              fontSize: 20,
                              fontWeight: 700,
                              letterSpacing: "-0.5px",
                           }}
                        >
                           VitaCare
                        </Text>
                        <div>
                           <Text
                              style={{
                                 color: "rgba(255, 255, 255, 0.6)",
                                 fontSize: 12,
                                 fontWeight: 500,
                              }}
                           >
                              Healthcare Platform
                           </Text>
                        </div>
                     </div>
                  )}
               </div>

               <div style={{ padding: "0 16px" }}>
                  <Menu
                     theme="dark"
                     selectedKeys={[activePage]}
                     mode="inline"
                     items={siderItems}
                     onClick={(e) => setActivePage(e.key)}
                     style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "15px",
                        fontWeight: 500,
                     }}
                  />
               </div>
            </Sider>

            {/* Main Layout */}
            <Layout style={{ background: "#f8fafc" }}>
               <Header
                  style={{
                     background: "#ffffff",
                     padding: "0 32px",
                     height: 80,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "flex-end",
                     boxShadow: "0 2px 24px rgba(0,0,0,0.04)",
                     borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
               >
                  {/* Right side controls */}
                  <Space size="large">
                     <Button
                        type="text"
                        icon={<SearchOutlined />}
                        shape="circle"
                        size="large"
                        style={{
                           background: "#f8fafc",
                           border: "1px solid #e2e8f0",
                           color: "#64748b",
                        }}
                     />
                     <Badge count={3} size="small">
                        <Button
                           type="text"
                           icon={<BellOutlined />}
                           shape="circle"
                           size="large"
                           style={{
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              color: "#64748b",
                           }}
                        />
                     </Badge>
                     <Dropdown
                        overlay={userMenu}
                        trigger={["click"]}
                        placement="bottomRight"
                     >
                        <Avatar
                           size={44}
                           style={{
                              cursor: "pointer",
                              background:
                                 "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                              border: "2px solid #ffffff",
                              boxShadow: "0 4px 16px rgba(99, 102, 241, 0.2)",
                           }}
                        >
                           <UserOutlined />
                        </Avatar>
                     </Dropdown>
                  </Space>
               </Header>

               <Content
                  style={{
                     margin: "32px",
                     display: "flex",
                     flexDirection: "column",
                     minHeight: "calc(100vh - 144px)",
                  }}
               >
                  {/* Dashboard Page */}
                  {activePage === "1" && (
                     <div
                        style={{
                           background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                           borderRadius: "32px",
                           padding: "80px 60px",
                           color: "#ffffff",
                           textAlign: "center",
                           position: "relative",
                           overflow: "hidden",
                           boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
                        }}
                     >
                        <Title
                           level={1}
                           style={{
                              color: "#ffffff",
                              fontSize: "48px",
                              fontWeight: 800,
                              marginBottom: "16px",
                              letterSpacing: "-2px",
                              lineHeight: 1.2,
                           }}
                        >
                           Bienvenue sur VitaCare
                        </Title>
                        <Text
                           style={{
                              color: "rgba(255, 255, 255, 0.9)",
                              fontSize: "20px",
                              fontWeight: 400,
                              lineHeight: 1.6,
                              maxWidth: "600px",
                              margin: "0 auto",
                              display: "block",
                           }}
                        >
                           Gérez vos documents médicaux, consultez vos analyses
                           et maintenez votre profil de santé en toute
                           simplicité.
                        </Text>
                     </div>
                  )}

                  {/* Analytics Page */}
                  {activePage === "2" && (
                     <Card
                        style={{
                           background: "#ffffff",
                           borderRadius: "24px",
                           border: "1px solid rgba(0,0,0,0.06)",
                           boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                           padding: "8px",
                           flex: 1,
                        }}
                        bodyStyle={{ padding: "32px" }}
                     >
                        <Title level={2}>Analytics</Title>
                        <Text>Visualisez vos statistiques de santé</Text>
                     </Card>
                  )}

                  {/* Documents Page */}
                  {activePage === "9" && (
                     <Card
                        style={{
                           background: "#ffffff",
                           borderRadius: "24px",
                           border: "1px solid rgba(0,0,0,0.06)",
                           boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                           padding: "8px",
                           flex: 1,
                        }}
                        bodyStyle={{ padding: "32px" }}
                     >
                        <div style={{ marginBottom: "24px" }}>
                           <Title level={2}>Gestion des Documents</Title>
                           <Text>
                              Organisez et gérez tous vos documents médicaux
                           </Text>
                        </div>
                        <GestionDocuments />
                     </Card>
                  )}

                  {/* Profile Page */}
                  {activePage === "10" && (
                     <div style={{ flex: 1 }}>
                        <GestionProfile />
                     </div>
                  )}
               </Content>
            </Layout>
         </Layout>
      </ConfigProvider>
   );
}
