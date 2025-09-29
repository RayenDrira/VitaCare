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
   LeftOutlined,
   RightOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

// Color palette
const PRIMARY = "#1A8BB7";
const SECONDARY = "#1ABC9C";
const BG_LIGHT = "#F8FAFC";
const BG_CARD = "#fff";
const SIDEBAR_BG = "#F3F6F9";
const SIDEBAR_BORDER = "#E3E8EF";
const TEXT_DARK = "#22313F";
const TEXT_MEDIUM = "#4B5C6B";
const GREY = "#B0B8C1";

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
         icon: <DashboardOutlined />,
         label: "Dashboard",
      },
      {
         key: "2",
         icon: <BarChartOutlined />,
         label: "Analytics",
      },
      {
         key: "9",
         icon: <FileTextOutlined />,
         label: "Documents",
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
               colorPrimary: PRIMARY,
               colorBgContainer: BG_LIGHT,
               colorBgElevated: BG_CARD,
               borderRadius: 16,
               boxShadow: "0 4px 24px rgba(26,139,183,0.08)",
               fontFamily:
                  "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
            },
            components: {
               Menu: {
                  itemBg: "transparent",
                  itemSelectedBg: "rgba(26, 139, 183, 0.10)",
                  itemSelectedColor: PRIMARY,
                  itemHoverBg: "rgba(26, 139, 183, 0.06)",
                  subMenuItemBg: "transparent",
               },
               Layout: {
                  siderBg: SIDEBAR_BG,
                  headerBg: BG_CARD,
               },
            },
         }}
      >
         <Layout
            style={{
               minHeight: "100vh",
               background: BG_LIGHT,
            }}
         >
            {/* Sidebar */}
            <Sider
               collapsible
               collapsed={collapsed}
               width={260}
               collapsedWidth={80}
               trigger={null}
               style={{
                  background: SIDEBAR_BG,
                  borderRight: `1.5px solid ${SIDEBAR_BORDER}`,
                  boxShadow: "0 2px 16px rgba(26,139,183,0.04)",
                  zIndex: 10,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
               }}
            >
               <div
                  style={{
                     height: 80,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: collapsed ? "center" : "flex-start",
                     paddingLeft: collapsed ? 0 : 24,
                     gap: 10,
                     position: "relative",
                  }}
               >
                  <img
                     src={Logo}
                     style={{
                        width: 40,
                        height: 40,
                        transition: "all 0.3s",
                        display: "block",
                        margin: collapsed ? "0 auto" : 0,
                     }}
                     alt="VitaCare"
                  />
                  {!collapsed && (
                     <span
                        style={{
                           color: PRIMARY,
                           fontSize: 24,
                           fontWeight: 700,
                           letterSpacing: "1px",
                           fontFamily: "Outfit",
                           marginLeft: 8,
                        }}
                     >
                        VitaCare
                     </span>
                  )}
               </div>
               <div style={{ padding: "0 8px" }}>
                  <Menu
                     selectedKeys={[activePage]}
                     mode="inline"
                     items={siderItems.map((item) => ({
                        ...item,
                        icon: React.cloneElement(item.icon, {
                           style: {
                              color: activePage === item.key ? PRIMARY : GREY,
                              fontSize: 20,
                              transition: "color 0.2s",
                           },
                        }),
                        label: (
                           <span
                              style={{
                                 color:
                                    activePage === item.key
                                       ? PRIMARY
                                       : TEXT_MEDIUM,
                                 fontWeight:
                                    activePage === item.key ? 700 : 500,
                                 letterSpacing: "0.2px",
                                 fontSize: 16,
                                 transition: "color 0.2s",
                              }}
                           >
                              {item.label}
                           </span>
                        ),
                        style: {
                           margin: "8px 0",
                           borderRadius: "10px",
                           background:
                              activePage === item.key
                                 ? "rgba(26,139,183,0.10)"
                                 : "transparent",
                           boxShadow:
                              activePage === item.key
                                 ? "0 4px 16px rgba(26,139,183,0.08)"
                                 : "none",
                           color:
                              activePage === item.key ? PRIMARY : TEXT_MEDIUM,
                           transition: "background 0.2s, box-shadow 0.2s",
                        },
                     }))}
                     onClick={(e) => setActivePage(e.key)}
                     style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "15px",
                        fontWeight: 500,
                     }}
                     theme="light"
                  />
               </div>
            </Sider>

            {/* Main Layout */}
            <Layout style={{ backgroundColor: BG_LIGHT }}>
               {/* Topbar as part of content */}
               <div
                  style={{
                     background: BG_CARD,
                     margin: "0px 0px 0 0px",
                     padding: "0 32px",
                     height: 80,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "space-between",
                     borderBottom: `1.5px solid ${SIDEBAR_BORDER}`,
                     boxShadow: "0 2px 12px rgba(26,139,183,0.04)",
                  }}
               >
                  <div style={{ display: "flex", alignItems: "center" }}>
                     <Title
                        level={3}
                        style={{
                           margin: 0,
                           color: TEXT_DARK,
                           fontWeight: 700,
                           letterSpacing: "-0.5px",
                        }}
                     >
                        {pageTitles[activePage]?.title || ""}
                     </Title>
                     <span
                        onClick={() => setCollapsed((prev) => !prev)}
                        style={{
                           marginLeft: 12,
                           cursor: "pointer",
                           display: "flex",
                           alignItems: "center",
                           height: 32,
                           width: 24,
                           userSelect: "none",
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={
                           collapsed ? "Expand sidebar" : "Collapse sidebar"
                        }
                     >
                        {collapsed ? (
                           <RightOutlined
                              style={{
                                 color: SECONDARY,
                                 fontSize: 16,
                                 fontWeight: 700,
                                 lineHeight: 1,
                              }}
                           />
                        ) : (
                           <LeftOutlined
                              style={{
                                 color: SECONDARY,
                                 fontSize: 16,
                                 fontWeight: 700,
                                 lineHeight: 1,
                              }}
                           />
                        )}
                     </span>
                     <Text
                        style={{
                           color: TEXT_MEDIUM,
                           fontWeight: 500,
                           marginLeft: 18,
                           fontSize: 16,
                        }}
                     >
                        {pageTitles[activePage]?.subtitle || ""}
                     </Text>
                  </div>

                  <Space size="large">
                     <Input
                        placeholder="Rechercher des documents..."
                        prefix={<SearchOutlined style={{ color: PRIMARY }} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onPressEnter={() => setActivePage("9")}
                        style={{
                           width: 240,
                           height: 40,
                           borderRadius: "20px",
                           background: BG_LIGHT,
                           border: `1.5px solid ${SIDEBAR_BORDER}`,
                           fontSize: "15px",
                           color: TEXT_DARK,
                        }}
                     />
                     <Badge count={3} size="small">
                        <Button
                           type="text"
                           icon={<BellOutlined style={{ color: PRIMARY }} />}
                           shape="circle"
                           size="large"
                           style={{
                              background: BG_LIGHT,
                              border: `1.5px solid ${SIDEBAR_BORDER}`,
                           }}
                        />
                     </Badge>
                     <Dropdown
                        overlay={userMenu}
                        trigger={["click"]}
                        placement="bottomRight"
                     >
                        <Avatar
                           size={40}
                           style={{
                              cursor: "pointer",
                              background: PRIMARY,
                              border: "2px solid #fff",
                              boxShadow: "0 2px 8px rgba(26,139,183,0.10)",
                           }}
                        >
                           <UserOutlined />
                        </Avatar>
                     </Dropdown>
                  </Space>
               </div>

               <Content
                  style={{
                     margin: "32px",
                     marginTop: 24,
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
                              background: BG_CARD,
                              borderRadius: "20px",
                              padding: "40px",
                              marginBottom: "32px",
                              boxShadow: "0 20px 60px rgba(26,139,183,0.10)",
                              border: `1.5px solid ${SIDEBAR_BORDER}`,
                           }}
                           bodyStyle={{ padding: 0 }}
                        >
                           <div style={{ textAlign: "center" }}>
                              <div>
                                 <img
                                    src={Logo}
                                    style={{
                                       width: 88,
                                       height: 88,
                                       transition: "all 0.3s",
                                    }}
                                    alt="VitaCare"
                                 />
                              </div>
                              <Title
                                 level={1}
                                 style={{
                                    color: PRIMARY,
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
                                    color: TEXT_MEDIUM,
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
                                    background: BG_CARD,
                                    borderRadius: "20px",
                                    border: `1.5px solid ${SIDEBAR_BORDER}`,
                                    boxShadow:
                                       "0 8px 32px rgba(26,139,183,0.10)",
                                 }}
                              >
                                 <Statistic
                                    title={
                                       <span
                                          style={{
                                             color: TEXT_MEDIUM,
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
                                          style={{ color: PRIMARY }}
                                       />
                                    }
                                    valueStyle={{
                                       color: PRIMARY,
                                       fontSize: "28px",
                                       fontWeight: 700,
                                    }}
                                 />
                              </Card>
                           </Col>
                           <Col xs={24} sm={12} lg={8}>
                              <Card
                                 style={{
                                    background: BG_CARD,
                                    borderRadius: "20px",
                                    border: `1.5px solid ${SIDEBAR_BORDER}`,
                                    boxShadow:
                                       "0 8px 32px rgba(26,139,183,0.10)",
                                 }}
                              >
                                 <Statistic
                                    title={
                                       <span
                                          style={{
                                             color: TEXT_MEDIUM,
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
                                          style={{ color: PRIMARY }}
                                       />
                                    }
                                    valueStyle={{
                                       color: PRIMARY,
                                       fontSize: "28px",
                                       fontWeight: 700,
                                    }}
                                 />
                              </Card>
                           </Col>
                           <Col xs={24} sm={12} lg={8}>
                              <Card
                                 style={{
                                    background: BG_CARD,
                                    borderRadius: "20px",
                                    border: `1.5px solid ${SIDEBAR_BORDER}`,
                                    boxShadow:
                                       "0 8px 32px rgba(26,139,183,0.10)",
                                 }}
                              >
                                 <Statistic
                                    title={
                                       <span
                                          style={{
                                             color: TEXT_MEDIUM,
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
                                          style={{ color: PRIMARY }}
                                       />
                                    }
                                    valueStyle={{
                                       color: PRIMARY,
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
                           background: BG_CARD,
                           borderRadius: "20px",
                           border: `1.5px solid ${SIDEBAR_BORDER}`,
                           boxShadow: "0 8px 32px rgba(26,139,183,0.10)",
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
                                 color: PRIMARY,
                                 marginBottom: 24,
                              }}
                           />
                           <Title level={3} style={{ color: TEXT_DARK }}>
                              Analytics
                           </Title>
                           <Text style={{ color: PRIMARY }}>
                              Vos statistiques de santé apparaîtront ici
                           </Text>
                        </div>
                     </Card>
                  )}

                  {/* Documents Page */}
                  {activePage === "9" && (
                     <Card
                        style={{
                           background: BG_CARD,
                           borderRadius: "20px",
                           border: `1.5px solid ${SIDEBAR_BORDER}`,
                           boxShadow: "0 8px 32px rgba(26,139,183,0.10)",
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
