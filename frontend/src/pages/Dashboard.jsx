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
   TeamOutlined,
   SettingOutlined,
   BellOutlined,
   SearchOutlined,
   MenuOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function Dashboard() {
   const [collapsed, setCollapsed] = useState(false);
   const [activeTopMenu, setActiveTopMenu] = useState("1");

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
         key: "sub1",
         icon: <UserOutlined style={{ fontSize: "18px" }} />,
         label: "Utilisateurs",
         style: { margin: "8px 0", borderRadius: "12px" },
         children: [
            { key: "3", label: "Dr. Martinez" },
            { key: "4", label: "Dr. Dubois" },
            { key: "5", label: "Dr. Rousseau" },
         ],
      },
      {
         key: "sub2",
         icon: <TeamOutlined style={{ fontSize: "18px" }} />,
         label: "Équipes",
         style: { margin: "8px 0", borderRadius: "12px" },
         children: [
            { key: "6", label: "Cardiologie" },
            { key: "8", label: "Neurologie" },
         ],
      },
      {
         key: "9",
         icon: <FileTextOutlined style={{ fontSize: "18px" }} />,
         label: "Documents",
         style: { margin: "8px 0", borderRadius: "12px" },
      },
   ];

   const userMenu = (
      <Menu style={{ borderRadius: "12px", padding: "8px" }}>
         <Menu.Item key="profile" icon={<UserOutlined />}>
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
                     defaultSelectedKeys={["1"]}
                     mode="inline"
                     items={siderItems}
                     style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "15px",
                        fontWeight: 500,
                     }}
                  />
               </div>

               {/* User profile at bottom */}
               {!collapsed && (
                  <div
                     style={{
                        position: "absolute",
                        bottom: 24,
                        left: 16,
                        right: 16,
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "16px",
                        padding: "16px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                     }}
                  >
                     <Space align="center">
                        <Avatar
                           size={40}
                           style={{ backgroundColor: "#6366f1" }}
                        >
                           <UserOutlined />
                        </Avatar>
                        <div>
                           <Text
                              style={{
                                 color: "#ffffff",
                                 fontWeight: 600,
                                 display: "block",
                              }}
                           >
                              Dr. Amira Ben Ali
                           </Text>
                           <Text
                              style={{
                                 color: "rgba(255, 255, 255, 0.6)",
                                 fontSize: 12,
                              }}
                           >
                              En ligne
                           </Text>
                        </div>
                     </Space>
                  </div>
               )}
            </Sider>

            <Layout style={{ background: "#f8fafc" }}>
               <Header
                  style={{
                     background: "#ffffff",
                     padding: "0 32px",
                     height: 80,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "space-between",
                     boxShadow: "0 2px 24px rgba(0,0,0,0.04)",
                     borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
               >
                  {/* Navigation Pills */}
                  <div
                     style={{
                        display: "flex",
                        background: "#f1f5f9",
                        borderRadius: "16px",
                        padding: "6px",
                        gap: "4px",
                     }}
                  >
                     {[
                        {
                           key: "1",
                           label: "Accueil",
                           icon: <DashboardOutlined />,
                        },
                        {
                           key: "2",
                           label: "Documents",
                           icon: <FileTextOutlined />,
                        },
                        { key: "3", label: "Profil", icon: <UserOutlined /> },
                     ].map((item) => (
                        <Button
                           key={item.key}
                           type={
                              activeTopMenu === item.key ? "primary" : "text"
                           }
                           icon={item.icon}
                           onClick={() => setActiveTopMenu(item.key)}
                           style={{
                              borderRadius: "12px",
                              fontWeight: 600,
                              fontSize: "14px",
                              height: "40px",
                              padding: "0 20px",
                              border: "none",
                              background:
                                 activeTopMenu === item.key
                                    ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                                    : "transparent",
                              color:
                                 activeTopMenu === item.key
                                    ? "#ffffff"
                                    : "#64748b",
                              boxShadow:
                                 activeTopMenu === item.key
                                    ? "0 4px 16px rgba(99, 102, 241, 0.3)"
                                    : "none",
                              transition:
                                 "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                           }}
                        >
                           {item.label}
                        </Button>
                     ))}
                  </div>

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
                  {activeTopMenu === "1" && (
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
                        {/* Decorative elements */}
                        <div
                           style={{
                              position: "absolute",
                              top: "-50px",
                              right: "-50px",
                              width: "200px",
                              height: "200px",
                              background: "rgba(255, 255, 255, 0.1)",
                              borderRadius: "50%",
                              backdropFilter: "blur(10px)",
                           }}
                        />
                        <div
                           style={{
                              position: "absolute",
                              bottom: "-30px",
                              left: "-30px",
                              width: "150px",
                              height: "150px",
                              background: "rgba(255, 255, 255, 0.05)",
                              borderRadius: "50%",
                              backdropFilter: "blur(5px)",
                           }}
                        />

                        <div style={{ position: "relative", zIndex: 2 }}>
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
                              Gérez vos documents médicaux, consultez vos
                              analyses et maintenez votre profil de santé en
                              toute simplicité.
                           </Text>

                           <Space size="large" style={{ marginTop: "40px" }}>
                              <Button
                                 size="large"
                                 style={{
                                    background: "#ffffff",
                                    color: "#667eea",
                                    border: "none",
                                    borderRadius: "16px",
                                    padding: "0 32px",
                                    height: "48px",
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    boxShadow:
                                       "0 8px 24px rgba(255, 255, 255, 0.2)",
                                 }}
                                 onClick={() => setActiveTopMenu("2")}
                              >
                                 Voir mes documents
                              </Button>
                              <Button
                                 size="large"
                                 style={{
                                    background: "rgba(255, 255, 255, 0.2)",
                                    color: "#ffffff",
                                    border:
                                       "1px solid rgba(255, 255, 255, 0.3)",
                                    borderRadius: "16px",
                                    padding: "0 32px",
                                    height: "48px",
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    backdropFilter: "blur(10px)",
                                 }}
                                 onClick={() => setActiveTopMenu("3")}
                              >
                                 Modifier mon profil
                              </Button>
                           </Space>
                        </div>
                     </div>
                  )}

                  {activeTopMenu === "2" && (
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
                           <Title
                              level={2}
                              style={{
                                 fontSize: "28px",
                                 fontWeight: 700,
                                 color: "#1a202c",
                                 margin: 0,
                                 letterSpacing: "-0.5px",
                              }}
                           >
                              Gestion des Documents
                           </Title>
                           <Text
                              style={{
                                 color: "#64748b",
                                 fontSize: "16px",
                                 marginTop: "8px",
                                 display: "block",
                              }}
                           >
                              Organisez et gérez tous vos documents médicaux
                           </Text>
                        </div>
                        <GestionDocuments />
                     </Card>
                  )}

                  {activeTopMenu === "3" && (
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
