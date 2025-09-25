import React, { useState } from "react";
import GestionDocuments from "../components/Documents";
import GestionProfile from "../components/GestionProfile";

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
   Input,
   Space,
   Row,
   Col,
   Statistic,
} from "antd";
import {
   DashboardOutlined,
   FileTextOutlined,
   UserOutlined,
   BarChartOutlined,
   SettingOutlined,
   BellOutlined,
   SearchOutlined,
   HeartOutlined,
   MedicineBoxOutlined,
   CalendarOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function Dashboard() {
   const [collapsed, setCollapsed] = useState(false);
   const [activePage, setActivePage] = useState("1");
   const pageTitles = {
      1: { title: "Dashboard", subtitle: "Bienvenue sur VitaCare" },
      2: {
         title: "Analytics",
         subtitle: "Visualisez vos statistiques de santé",
      },
      9: {
         title: "Documents",
         subtitle: "Organisez et gérez tous vos documents médicaux",
      },
      10: { title: "Profil", subtitle: "Gérez vos informations personnelles" },
   };

   const siderItems = [
      {
         key: "1",
         icon: <DashboardOutlined style={{ fontSize: "18px" }} />,
         label: "Dashboard",
         style: { margin: "8px 0" },
      },
      {
         key: "2",
         icon: <BarChartOutlined style={{ fontSize: "18px" }} />,
         label: "Analytics",
         style: { margin: "8px 0" },
      },
      {
         key: "9",
         icon: <FileTextOutlined style={{ fontSize: "18px" }} />,
         label: "Documents",
         style: { margin: "8px 0" },
      },
   ];

   const [searchQuery, setSearchQuery] = useState("");

   const userMenu = (
      <Menu
         style={{ padding: "8px" }}
         onClick={(e) => {
            if (e.key === "10") {
               setActivePage("10");
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
               colorPrimary: "#1A8BB7",
               colorBgContainer: "#ffffff",
               colorBgElevated: "#ffffff",
               borderRadius: 0,
               boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
               fontFamily:
                  "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
            },
            components: {
               Menu: {
                  itemBg: "transparent",
                  itemSelectedBg: "rgba(49, 193, 225, 0.1)",
                  itemSelectedColor: "#1A8BB7",
                  itemHoverBg: "rgba(49, 193, 225, 0.05)",
                  subMenuItemBg: "transparent",
               },
               Layout: {
                  siderBg: "linear-gradient(145deg, #f8fdff 0%, #e8f8fc 100%)",
                  headerBg: "#ffffff",
               },
            },
         }}
      >
         <Layout
            style={{
               minHeight: "100vh",
               background:
                  "#0F2438",
            }}
         >
            {/* Sidebar */}
            <Sider
               collapsible
               collapsed={collapsed}
               onCollapse={setCollapsed}
               width={280}
               collapsedWidth={80}
               style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: collapsed ? "0" : "0",
                  boxShadow: "0 8px 32px rgba(49, 193, 225, 0.15)",
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
                     background:
                        "linear-gradient(135deg, #31c1e1 0%, #4dd0e7 100%)",
                     borderRadius: "20px",
                     padding: "0 16px",
                     transition: "all 0.3s ease",
                     boxShadow: "0 4px 20px rgba(49, 193, 225, 0.3)",
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
                                 color: "rgba(255, 255, 255, 0.8)",
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
            <Layout style={{ background: "transparent" }}>
               <Header
                  style={{
                     background: "rgba(255, 255, 255, 0.95)",
                     backdropFilter: "blur(10px)",
                     padding: "0 32px",
                     height: 80,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "space-between",
                     boxShadow: "0 2px 24px rgba(49, 193, 225, 0.1)",
                     borderRadius: "0",
                     margin: "0",
                  }}
               >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                     <Title level={4} style={{ margin: 0, color: "#2c5aa0" }}>
                        {pageTitles[activePage]?.title || ""}
                     </Title>
                     <Text style={{ color: "#31c1e1" }}>
                        {pageTitles[activePage]?.subtitle || ""}
                     </Text>
                  </div>

                  <Space size="large">
                     <Input
                        placeholder="Rechercher des documents..."
                        prefix={<SearchOutlined style={{ color: "#31c1e1" }} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onPressEnter={() => setActivePage("9")}
                        style={{
                           width: 250,
                           height: 40,
                           borderRadius: "20px",
                           background: "rgba(255, 255, 255, 0.8)",
                           border: "2px solid rgba(49, 193, 225, 0.2)",
                        }}
                     />
                     <Badge count={3} size="small">
                        <Button
                           type="text"
                           icon={<BellOutlined style={{ color: "#31c1e1" }} />}
                           shape="circle"
                           size="large"
                           style={{
                              background: "rgba(49, 193, 225, 0.1)",
                              border: "2px solid rgba(49, 193, 225, 0.2)",
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
                                 "linear-gradient(135deg, #31c1e1 0%, #4dd0e7 100%)",
                              border: "2px solid #ffffff",
                              boxShadow: "0 4px 16px rgba(49, 193, 225, 0.3)",
                           }}
                        >
                           <UserOutlined />
                        </Avatar>
                     </Dropdown>
                  </Space>
               </Header>

               <Content
                  style={{
                     margin: "24px 16px",
                     display: "flex",
                     flexDirection: "column",
                     minHeight: "calc(100vh - 144px)",
                  }}
               >
                  {/* Dashboard Page */}
                  {activePage === "1" && (
                     <div>
                        {/* Hero Section */}
                        <Card
                           style={{
                              background: "rgba(255, 255, 255, 0.95)",
                              backdropFilter: "blur(10px)",
                              borderRadius: "16px",
                              padding: "40px",
                              marginBottom: "32px",
                     
                              boxShadow: "0 20px 60px rgba(49, 193, 225, 0.15)",
                           }}
                           bodyStyle={{ padding: 0 }}
                        >
                           <div style={{ textAlign: "center" }}>
                              <div
                                 style={{
                                    background:
                                       "linear-gradient(135deg, #31c1e1 0%, #4dd0e7 100%)",
                                    width: "120px",
                                    height: "120px",
                                    borderRadius: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 32px",
                                    boxShadow:
                                       "0 12px 40px rgba(49, 193, 225, 0.3)",
                                 }}
                              >
                                 <HeartOutlined
                                    style={{ fontSize: 48, color: "#ffffff" }}
                                 />
                              </div>
                              <Title
                                 level={1}
                                 style={{
                                    color: "#2c5aa0",
                                    fontSize: "42px",
                                    fontWeight: 700,
                                    marginBottom: "16px",
                                    fontFamily: "Outfit",
                                 }}
                              >
                                 Bienvenue sur VitaCare
                              </Title>
                              <Text
                                 style={{
                                    color: "#31c1e1",
                                    fontSize: "18px",
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                    maxWidth: "600px",
                                    margin: "0 auto",
                                    display: "block",
                                 }}
                              >
                                 Votre plateforme de santé personnalisée pour
                                 gérer vos documents médicaux et suivre votre
                                 bien-être au quotidien.
                              </Text>
                           </div>
                        </Card>

                        {/* Statistics Cards */}
                        <Row gutter={[24, 24]}>
                           <Col xs={24} sm={12} lg={8}>
                              <Card
                                 style={{
                                    background: "rgba(255, 255, 255, 0.95)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: "16px",
                                    border: "1px solid rgba(49, 193, 225, 0.2)",
                                    boxShadow:
                                       "0 8px 32px rgba(49, 193, 225, 0.1)",
                                 }}
                              >
                                 <Statistic
                                    title={
                                       <span
                                          style={{
                                             color: "#2c5aa0",
                                             fontSize: "16px",
                                             fontWeight: 600,
                                          }}
                                       >
                                          Documents
                                       </span>
                                    }
                                    value={12}
                                    prefix={
                                       <FileTextOutlined
                                          style={{ color: "#31c1e1" }}
                                       />
                                    }
                                    valueStyle={{
                                       color: "#31c1e1",
                                       fontSize: "28px",
                                       fontWeight: 700,
                                    }}
                                 />
                              </Card>
                           </Col>
                           <Col xs={24} sm={12} lg={8}>
                              <Card
                                 style={{
                                    background: "rgba(255, 255, 255, 0.95)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: "16px",
                                    border: "1px solid rgba(49, 193, 225, 0.2)",
                                    boxShadow:
                                       "0 8px 32px rgba(49, 193, 225, 0.1)",
                                 }}
                              >
                                 <Statistic
                                    title={
                                       <span
                                          style={{
                                             color: "#2c5aa0",
                                             fontSize: "16px",
                                             fontWeight: 600,
                                          }}
                                       >
                                          Consultations
                                       </span>
                                    }
                                    value={8}
                                    prefix={
                                       <MedicineBoxOutlined
                                          style={{ color: "#31c1e1" }}
                                       />
                                    }
                                    valueStyle={{
                                       color: "#31c1e1",
                                       fontSize: "28px",
                                       fontWeight: 700,
                                    }}
                                 />
                              </Card>
                           </Col>
                           <Col xs={24} sm={12} lg={8}>
                              <Card
                                 style={{
                                    background: "rgba(255, 255, 255, 0.95)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: "16px",
                                    border: "1px solid rgba(49, 193, 225, 0.2)",
                                    boxShadow:
                                       "0 8px 32px rgba(49, 193, 225, 0.1)",
                                 }}
                              >
                                 <Statistic
                                    title={
                                       <span
                                          style={{
                                             color: "#2c5aa0",
                                             fontSize: "16px",
                                             fontWeight: 600,
                                          }}
                                       >
                                          Rendez-vous
                                       </span>
                                    }
                                    value={3}
                                    prefix={
                                       <CalendarOutlined
                                          style={{ color: "#31c1e1" }}
                                       />
                                    }
                                    valueStyle={{
                                       color: "#31c1e1",
                                       fontSize: "28px",
                                       fontWeight: 700,
                                    }}
                                 />
                              </Card>
                           </Col>
                        </Row>
                     </div>
                  )}

                  {/* Analytics Page */}
                  {activePage === "2" && (
                     <Card
                        style={{
                           background: "rgba(255, 255, 255, 0.95)",
                           backdropFilter: "blur(10px)",
                           borderRadius: "24px",
                           border: "1px solid rgba(49, 193, 225, 0.2)",
                           boxShadow: "0 8px 32px rgba(49, 193, 225, 0.1)",
                           flex: 1,
                        }}
                        bodyStyle={{ padding: "32px" }}
                     >
                        <div
                           style={{ textAlign: "center", padding: "60px 20px" }}
                        >
                           <BarChartOutlined
                              style={{
                                 fontSize: 64,
                                 color: "#31c1e1",
                                 marginBottom: 24,
                              }}
                           />
                           <Title level={3} style={{ color: "#2c5aa0" }}>
                              Analytics
                           </Title>
                           <Text style={{ color: "#31c1e1" }}>
                              Vos statistiques de santé apparaîtront ici
                           </Text>
                        </div>
                     </Card>
                  )}

                  {/* Documents Page */}
                  {activePage === "9" && (
                     <Card
                        style={{
                           background: "rgba(255, 255, 255, 0.95)",
                           backdropFilter: "blur(10px)",
                           borderRadius: "24px",
                           border: "1px solid rgba(49, 193, 225, 0.2)",
                           boxShadow: "0 8px 32px rgba(49, 193, 225, 0.1)",
                           flex: 1,
                        }}
                        bodyStyle={{ padding: "32px" }}
                     >
                        <GestionDocuments searchQuery={searchQuery} />
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
