import React, { useState, useEffect } from "react";
import GestionDocuments from "../components/Documents";
import GestionProfile from "../components/GestionProfile";
import Sidebar from "../components/Sidebar/Sidebar";
import { useSidebar } from "../hooks/useSidebar";
import { COLORS, PAGE_TITLES, SIDER_ITEMS } from "../constants";

import Logo from "../assets/VitaCare_logo.png";

import {
   Layout,
   ConfigProvider,
   Card,
   Typography,
   Badge,
   Avatar,
   Dropdown,
   Button,
   Input,
   Row,
   Col,
   Statistic,
   Menu,
} from "antd";
import {
   UserOutlined,
   SettingOutlined,
   BellOutlined,
   SearchOutlined,
   MedicineBoxOutlined,
   CalendarOutlined,
   FileTextOutlined,
   BarChartOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

// Destructure colors from constants
const { PRIMARY, BG_LIGHT, BG_CARD, SIDEBAR_BORDER, TEXT_DARK, TEXT_MEDIUM } =
   COLORS;

function Dashboard() {
   const { collapsed, setCollapsed, activePage, setActivePage } = useSidebar();
   const [searchQuery, setSearchQuery] = useState("");

   // Clear search when navigating away from Documents page
   useEffect(() => {
      if (activePage !== "9" && searchQuery) {
         // Optional: clear search when leaving documents
         // setSearchQuery("");
      }
   }, [activePage, searchQuery]);

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
                  siderBg: COLORS.SIDEBAR_BG,
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
            <Sidebar
               collapsed={collapsed}
               setCollapsed={setCollapsed}
               activePage={activePage}
               setActivePage={setActivePage}
               siderItems={SIDER_ITEMS}
            />

            <Layout style={{ backgroundColor: BG_LIGHT }}>
               {/* Topbar */}
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
                        {PAGE_TITLES[activePage]?.title || ""}
                     </Title>
                     
                  </div>

                  <div
                     style={{ display: "flex", alignItems: "center", gap: 16 }}
                  >
                     <Input
                        placeholder="Rechercher des documents... (Appuyez sur Entrée)"
                        prefix={
                           <SearchOutlined style={{ color: TEXT_MEDIUM }} />
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onPressEnter={() => {
                           if (searchQuery.trim()) {
                              setActivePage("9"); // Navigate to documents page
                           }
                        }}
                        style={{
                           width: 300,
                           borderRadius: 32,
                           backgroundColor: BG_LIGHT,
                           border: searchQuery
                              ? `2px solid ${PRIMARY}20`
                              : "none",
                           boxShadow: searchQuery
                              ? "0 2px 12px rgba(26,139,183,0.15)"
                              : "0 2px 8px rgba(26,139,183,0.08)",
                        }}
                        size="large"
                        allowClear
                     />
                     <Badge count={3} dot>
                        <Button
                           type="text"
                           shape="circle"
                           icon={
                              <BellOutlined
                                 style={{ fontSize: 18, color: TEXT_MEDIUM }}
                              />
                           }
                           size="large"
                           style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                           }}
                        />
                     </Badge>
                     <Dropdown overlay={userMenu} trigger={["click"]}>
                        <Avatar
                           icon={<UserOutlined />}
                           style={{
                              backgroundColor: PRIMARY,
                              cursor: "pointer",
                              fontSize: 18,
                           }}
                           size="large"
                        />
                     </Dropdown>
                  </div>
               </div>

               <Content
                  style={{
                     padding: "32px",
                     background: BG_LIGHT,
                     minHeight: "calc(100vh - 80px)",
                  }}
               >
                  {activePage === "1" && (
                     <Row gutter={[32, 32]}>
                        <Col span={24}>
                           <Card
                              style={{
                                 borderRadius: 20,
                                 background: `linear-gradient(135deg, ${PRIMARY}15, ${PRIMARY}05)`,
                                 border: `1.5px solid ${PRIMARY}20`,
                                 boxShadow: "0 8px 32px rgba(26,139,183,0.12)",
                              }}
                           >
                              <div
                                 style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                 }}
                              >
                                 <div>
                                    <Title
                                       level={2}
                                       style={{ color: PRIMARY, margin: 0 }}
                                    >
                                       Bienvenue sur VitaCare
                                    </Title>
                                    <Text
                                       style={{
                                          fontSize: 18,
                                          color: TEXT_MEDIUM,
                                          fontWeight: 500,
                                       }}
                                    >
                                       Gérez votre santé en toute simplicité
                                    </Text>
                                 </div>
                                 <img
                                    src={Logo}
                                    alt="VitaCare"
                                    style={{ width: 80, height: 80 }}
                                 />
                              </div>
                           </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                           <Card
                              style={{
                                 borderRadius: 16,
                                 border: "none",
                                 boxShadow: "0 4px 24px rgba(26,139,183,0.08)",
                              }}
                           >
                              <Statistic
                                 title="Documents"
                                 value={12}
                                 prefix={
                                    <FileTextOutlined
                                       style={{ color: PRIMARY, fontSize: 24 }}
                                    />
                                 }
                                 valueStyle={{
                                    color: PRIMARY,
                                    fontWeight: 700,
                                 }}
                              />
                           </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                           <Card
                              style={{
                                 borderRadius: 16,
                                 border: "none",
                                 boxShadow: "0 4px 24px rgba(26,139,183,0.08)",
                              }}
                           >
                              <Statistic
                                 title="Rendez-vous"
                                 value={3}
                                 prefix={
                                    <CalendarOutlined
                                       style={{
                                          color: "#52c41a",
                                          fontSize: 24,
                                       }}
                                    />
                                 }
                                 valueStyle={{
                                    color: "#52c41a",
                                    fontWeight: 700,
                                 }}
                              />
                           </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                           <Card
                              style={{
                                 borderRadius: 16,
                                 border: "none",
                                 boxShadow: "0 4px 24px rgba(26,139,183,0.08)",
                              }}
                           >
                              <Statistic
                                 title="Traitements"
                                 value={2}
                                 prefix={
                                    <MedicineBoxOutlined
                                       style={{
                                          color: "#fa8c16",
                                          fontSize: 24,
                                       }}
                                    />
                                 }
                                 valueStyle={{
                                    color: "#fa8c16",
                                    fontWeight: 700,
                                 }}
                              />
                           </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                           <Card
                              style={{
                                 borderRadius: 16,
                                 border: "none",
                                 boxShadow: "0 4px 24px rgba(26,139,183,0.08)",
                              }}
                           >
                              <Statistic
                                 title="Alertes médicaux"
                                 value={1}
                                 prefix={
                                    <BellOutlined
                                       style={{
                                          color: COLORS.WARNING,
                                          fontSize: 24,
                                       }}
                                    />
                                 }
                                 valueStyle={{
                                    color: COLORS.WARNING,
                                    fontWeight: 700,
                                 }}
                              />
                           </Card>
                        </Col>
                     </Row>
                  )}
                  {activePage === "2" && (
                     <Card
                        style={{
                           borderRadius: 16,
                           border: "none",
                           boxShadow: "0 4px 24px rgba(26,139,183,0.08)",
                           textAlign: "center",
                           padding: "64px 32px",
                        }}
                     >
                        <BarChartOutlined
                           style={{
                              fontSize: 80,
                              color: PRIMARY,
                              marginBottom: 24,
                           }}
                        />
                        <Title
                           level={2}
                           style={{ color: TEXT_DARK, marginBottom: 16 }}
                        >
                           Analytics Dashboard
                        </Title>
                        <Text style={{ fontSize: 18, color: TEXT_MEDIUM }}>
                           Visualisez vos statistiques de santé et suivez votre
                           évolution
                        </Text>
                     </Card>
                  )}
                  {activePage === "9" && (
                     <GestionDocuments searchQuery={searchQuery} />
                  )}
                  {activePage === "10" && <GestionProfile />}
               </Content>
            </Layout>
         </Layout>
      </ConfigProvider>
   );
}

export default Dashboard;
