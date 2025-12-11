import React, { useState, useEffect } from "react";
import GestionDocuments from "../components/Documents";
import GestionProfile from "../components/GestionProfile";
import Sidebar from "../components/Sidebar/Sidebar";
import { useSidebar } from "../hooks/useSidebar";
import { COLORS, PAGE_TITLES, SIDER_ITEMS } from "../constants";
import { apiFetch, getEmailFromToken } from "../utils/api";
import moment from "moment";

import Logo from "../assets/VitaCare_logo.png";

import {
   Layout,
   ConfigProvider,
   Card,
   Typography,
   Avatar,
   Dropdown,
   Input,
   Row,
   Col,
   Menu,
} from "antd";
import {
   UserOutlined,
   SettingOutlined,
   BellOutlined,
   SearchOutlined,
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
   const [userData, setUserData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [documentCount, setDocumentCount] = useState(0);
   const [tagCount, setTagCount] = useState(0);

   // Fetch user data and documents for dashboard
   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            setLoading(true);
            const email = getEmailFromToken();
            if (!email) return;

            // Fetch user profile
            const profileRes = await apiFetch(
               `/api/profile/user/by-email/${email}`
            );
            if (profileRes.ok) {
               const user = await profileRes.json();
               setUserData(user);
            }

            // Fetch documents count
            const docsRes = await apiFetch(
               `/api/documents?email=${encodeURIComponent(email)}`
            );
            if (docsRes.ok) {
               const docs = await docsRes.json();
               setDocumentCount(docs.length);

               // Count unique tags from documents
               const uniqueTags = new Set();
               docs.forEach((doc) => {
                  if (doc.tagNames && Array.isArray(doc.tagNames)) {
                     doc.tagNames.forEach((tag) => uniqueTags.add(tag));
                  }
               });
               setTagCount(uniqueTags.size);
            }
         } catch (err) {
            console.error("Error fetching dashboard data:", err);
         } finally {
            setLoading(false);
         }
      };
      fetchDashboardData();
   }, []);

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
                                 borderRadius: 24,
                                 background:
                                    "linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)",
                                 border: "none",
                                 boxShadow: "0 8px 32px rgba(26,139,183,0.12)",
                                 overflow: "hidden",
                              }}
                           >
                              <div
                                 style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "8px 0",
                                 }}
                              >
                                 <div>
                                    <Title
                                       level={2}
                                       style={{
                                          color: PRIMARY,
                                          margin: 0,
                                          fontWeight: 700,
                                       }}
                                    >
                                       Bienvenue{" "}
                                       {userData?.firstName
                                          ? `${userData.firstName}`
                                          : "sur VitaCare"}
                                    </Title>
                                    <Text
                                       style={{
                                          fontSize: 16,
                                          color: TEXT_MEDIUM,
                                          fontWeight: 500,
                                       }}
                                    >
                                       Gérez votre santé en toute simplicité
                                    </Text>
                                 </div>
                                 <div
                                    style={{
                                       width: 80,
                                       height: 80,
                                       borderRadius: 20,
                                       background: `${PRIMARY}15`,
                                       display: "flex",
                                       alignItems: "center",
                                       justifyContent: "center",
                                    }}
                                 >
                                    <img
                                       src={Logo}
                                       alt="VitaCare"
                                       style={{ width: 60, height: 60 }}
                                    />
                                 </div>
                              </div>
                           </Card>
                        </Col>

                        {/* Real-time Analytics Cards */}
                        <Col xs={24} sm={12} lg={8}>
                           <Card
                              style={{
                                 borderRadius: 16,
                                 border: "none",
                                 boxShadow: "0 2px 8px rgba(26,139,183,0.06)",
                                 background: "white",
                                 overflow: "hidden",
                                 transition: "all 0.3s ease",
                              }}
                              bodyStyle={{ padding: 16 }}
                           >
                              <div
                                 style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                 }}
                              >
                                 <div
                                    style={{
                                       display: "flex",
                                       alignItems: "center",
                                       justifyContent: "center",
                                       width: 48,
                                       height: 48,
                                       borderRadius: 12,
                                       background: `${PRIMARY}15`,
                                       flexShrink: 0,
                                    }}
                                 >
                                    <FileTextOutlined
                                       style={{ fontSize: 20, color: PRIMARY }}
                                    />
                                 </div>
                                 <div style={{ flex: 1 }}>
                                    <Text
                                       style={{
                                          fontSize: 12,
                                          color: TEXT_MEDIUM,
                                          display: "block",
                                          marginBottom: 4,
                                       }}
                                    >
                                       documents
                                    </Text>
                                    <div
                                       style={{
                                          display: "flex",
                                          alignItems: "baseline",
                                          gap: 6,
                                       }}
                                    >
                                       <Text
                                          style={{
                                             fontSize: 24,
                                             fontWeight: 700,
                                             color: PRIMARY,
                                             lineHeight: 1,
                                          }}
                                       >
                                          {documentCount}
                                       </Text>
                                       <Text
                                          style={{
                                             fontSize: 12,
                                             color: TEXT_MEDIUM,
                                             fontWeight: 500,
                                          }}
                                       >
                                          fichiers
                                       </Text>
                                    </div>
                                 </div>
                              </div>
                           </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                           <Card
                              style={{
                                 borderRadius: 16,
                                 border: "none",
                                 boxShadow: "0 2px 8px rgba(82,196,26,0.06)",
                                 background: "white",
                                 overflow: "hidden",
                                 transition: "all 0.3s ease",
                              }}
                              bodyStyle={{ padding: 16 }}
                           >
                              <div
                                 style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                 }}
                              >
                                 <div
                                    style={{
                                       display: "flex",
                                       alignItems: "center",
                                       justifyContent: "center",
                                       width: 48,
                                       height: 48,
                                       borderRadius: 12,
                                       background: "#52c41a15",
                                       flexShrink: 0,
                                    }}
                                 >
                                    <FileTextOutlined
                                       style={{
                                          fontSize: 20,
                                          color: "#52c41a",
                                       }}
                                    />
                                 </div>
                                 <div style={{ flex: 1 }}>
                                    <Text
                                       style={{
                                          fontSize: 12,
                                          color: TEXT_MEDIUM,
                                          display: "block",
                                          marginBottom: 4,
                                       }}
                                    >
                                       étiquettes
                                    </Text>
                                    <div
                                       style={{
                                          display: "flex",
                                          alignItems: "baseline",
                                          gap: 6,
                                       }}
                                    >
                                       <Text
                                          style={{
                                             fontSize: 24,
                                             fontWeight: 700,
                                             color: "#52c41a",
                                             lineHeight: 1,
                                          }}
                                       >
                                          {tagCount}
                                       </Text>
                                       <Text
                                          style={{
                                             fontSize: 12,
                                             color: TEXT_MEDIUM,
                                             fontWeight: 500,
                                          }}
                                       >
                                          créées
                                       </Text>
                                    </div>
                                 </div>
                              </div>
                           </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                           <Card
                              style={{
                                 borderRadius: 16,
                                 border: "none",
                                 boxShadow: "0 2px 8px rgba(255,77,79,0.06)",
                                 background: "white",
                                 overflow: "hidden",
                                 transition: "all 0.3s ease",
                              }}
                              bodyStyle={{ padding: 16 }}
                           >
                              <div
                                 style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                 }}
                              >
                                 <div
                                    style={{
                                       display: "flex",
                                       alignItems: "center",
                                       justifyContent: "center",
                                       width: 48,
                                       height: 48,
                                       borderRadius: 12,
                                       background: `${COLORS.WARNING}15`,
                                       flexShrink: 0,
                                    }}
                                 >
                                    <BellOutlined
                                       style={{
                                          fontSize: 20,
                                          color: COLORS.WARNING,
                                       }}
                                    />
                                 </div>
                                 <div style={{ flex: 1 }}>
                                    <Text
                                       style={{
                                          fontSize: 12,
                                          color: TEXT_MEDIUM,
                                          display: "block",
                                          marginBottom: 4,
                                       }}
                                    >
                                       alertes médicales
                                    </Text>
                                    <div
                                       style={{
                                          display: "flex",
                                          alignItems: "baseline",
                                          gap: 6,
                                       }}
                                    >
                                       <Text
                                          style={{
                                             fontSize: 24,
                                             fontWeight: 700,
                                             color: COLORS.WARNING,
                                             lineHeight: 1,
                                          }}
                                       >
                                          {(userData?.allergies &&
                                          userData.allergies.trim()
                                             ? userData.allergies.split(",")
                                                  .length
                                             : 0) +
                                             (userData?.chronicConditions &&
                                             userData.chronicConditions.trim()
                                                ? userData.chronicConditions.split(
                                                     ","
                                                  ).length
                                                : 0) +
                                             (userData?.médicaments &&
                                             userData.medications.trim()
                                                ? userData.medications.split(
                                                     ","
                                                  ).length
                                                : 0)}
                                       </Text>
                                       <Text
                                          style={{
                                             fontSize: 12,
                                             color: TEXT_MEDIUM,
                                             fontWeight: 500,
                                          }}
                                       >
                                          actives
                                       </Text>
                                    </div>
                                 </div>
                              </div>
                           </Card>
                        </Col>

                        {/* Personal Information Section */}
                        {userData && !loading && (
                           <Col span={24}>
                              <Card
                                 style={{
                                    borderRadius: 16,
                                    border: "none",
                                    boxShadow:
                                       "0 2px 8px rgba(26,139,183,0.06)",
                                    background: "white",
                                 }}
                                 bodyStyle={{ padding: 20 }}
                              >
                                 <Title
                                    level={4}
                                    style={{
                                       margin: 0,
                                       marginBottom: 20,
                                       color: TEXT_DARK,
                                       fontWeight: 600,
                                    }}
                                 >
                                    informations personnelles
                                 </Title>

                                 <Row gutter={[24, 24]}>
                                    {/* Demographics Card */}
                                    <Col xs={24} lg={8}>
                                       <Card
                                          style={{
                                             height: "100%",
                                             borderRadius: 12,
                                             border: `1px solid ${PRIMARY}15`,
                                          }}
                                          bodyStyle={{ padding: 20 }}
                                       >
                                          <Title
                                             level={5}
                                             style={{
                                                margin: 0,
                                                marginBottom: 16,
                                                color: TEXT_DARK,
                                             }}
                                          >
                                             informations démographiques
                                          </Title>
                                          <div
                                             style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 16,
                                             }}
                                          >
                                             {userData.dateOfBirth && (
                                                <div>
                                                   <Text
                                                      style={{
                                                         fontSize: 12,
                                                         color: TEXT_MEDIUM,
                                                         display: "block",
                                                         marginBottom: 4,
                                                      }}
                                                   >
                                                      âge
                                                   </Text>
                                                   <Text
                                                      strong
                                                      style={{
                                                         fontSize: 18,
                                                         color: TEXT_DARK,
                                                      }}
                                                   >
                                                      {moment().diff(
                                                         moment(
                                                            userData.dateOfBirth
                                                         ),
                                                         "years"
                                                      )}{" "}
                                                      ans
                                                   </Text>
                                                </div>
                                             )}
                                             {userData.gender && (
                                                <div>
                                                   <Text
                                                      style={{
                                                         fontSize: 12,
                                                         color: TEXT_MEDIUM,
                                                         display: "block",
                                                         marginBottom: 4,
                                                      }}
                                                   >
                                                      genre
                                                   </Text>
                                                   <Text
                                                      strong
                                                      style={{
                                                         fontSize: 18,
                                                         color: TEXT_DARK,
                                                      }}
                                                   >
                                                      {userData.gender ===
                                                      "MALE"
                                                         ? "homme"
                                                         : "femme"}
                                                   </Text>
                                                </div>
                                             )}
                                             {userData.phoneNumber && (
                                                <div>
                                                   <Text
                                                      style={{
                                                         fontSize: 12,
                                                         color: TEXT_MEDIUM,
                                                         display: "block",
                                                         marginBottom: 4,
                                                      }}
                                                   >
                                                      téléphone
                                                   </Text>
                                                   <Text
                                                      strong
                                                      style={{
                                                         fontSize: 16,
                                                         color: TEXT_DARK,
                                                      }}
                                                   >
                                                      {userData.phoneNumber}
                                                   </Text>
                                                </div>
                                             )}
                                             {userData.bloodType && (
                                                <div>
                                                   <Text
                                                      style={{
                                                         fontSize: 12,
                                                         color: TEXT_MEDIUM,
                                                         display: "block",
                                                         marginBottom: 4,
                                                      }}
                                                   >
                                                      groupe sanguin
                                                   </Text>
                                                   <Text
                                                      strong
                                                      style={{
                                                         fontSize: 18,
                                                         color: TEXT_DARK,
                                                      }}
                                                   >
                                                      {userData.bloodType}
                                                   </Text>
                                                </div>
                                             )}
                                          </div>
                                       </Card>
                                    </Col>

                                    {/* Health Metrics Card */}
                                    <Col xs={24} lg={8}>
                                       <Card
                                          style={{
                                             height: "100%",
                                             borderRadius: 12,
                                             border: `1px solid ${PRIMARY}15`,
                                          }}
                                          bodyStyle={{ padding: 20 }}
                                       >
                                          <Title
                                             level={5}
                                             style={{
                                                margin: 0,
                                                marginBottom: 16,
                                                color: TEXT_DARK,
                                             }}
                                          >
                                             métriques de santé
                                          </Title>
                                          <div
                                             style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 16,
                                             }}
                                          >
                                             {userData.height &&
                                                Number(userData.height) > 0 && (
                                                   <div>
                                                      <Text
                                                         style={{
                                                            fontSize: 12,
                                                            color: TEXT_MEDIUM,
                                                            display: "block",
                                                            marginBottom: 4,
                                                         }}
                                                      >
                                                         taille
                                                      </Text>
                                                      <Text
                                                         strong
                                                         style={{
                                                            fontSize: 18,
                                                            color: TEXT_DARK,
                                                         }}
                                                      >
                                                         {userData.height} cm
                                                      </Text>
                                                   </div>
                                                )}
                                             {userData.weight &&
                                                Number(userData.weight) > 0 && (
                                                   <div>
                                                      <Text
                                                         style={{
                                                            fontSize: 12,
                                                            color: TEXT_MEDIUM,
                                                            display: "block",
                                                            marginBottom: 4,
                                                         }}
                                                      >
                                                         poids
                                                      </Text>
                                                      <Text
                                                         strong
                                                         style={{
                                                            fontSize: 18,
                                                            color: TEXT_DARK,
                                                         }}
                                                      >
                                                         {userData.weight} kg
                                                      </Text>
                                                   </div>
                                                )}
                                             {userData.height &&
                                                Number(userData.height) > 0 &&
                                                userData.weight &&
                                                Number(userData.weight) > 0 && (
                                                   <div>
                                                      <Text
                                                         style={{
                                                            fontSize: 12,
                                                            color: TEXT_MEDIUM,
                                                            display: "block",
                                                            marginBottom: 4,
                                                         }}
                                                      >
                                                         imc
                                                      </Text>
                                                      <Text
                                                         strong
                                                         style={{
                                                            fontSize: 18,
                                                            color: TEXT_DARK,
                                                         }}
                                                      >
                                                         {(
                                                            userData.weight /
                                                            Math.pow(
                                                               userData.height /
                                                                  100,
                                                               2
                                                            )
                                                         ).toFixed(1)}
                                                      </Text>
                                                      <Text
                                                         style={{
                                                            color: (() => {
                                                               const bmi =
                                                                  userData.weight /
                                                                  Math.pow(
                                                                     userData.height /
                                                                        100,
                                                                     2
                                                                  );
                                                               if (bmi < 18.5)
                                                                  return "#fa8c16";
                                                               if (bmi < 25)
                                                                  return "#52c41a";
                                                               if (bmi < 30)
                                                                  return "#fa8c16";
                                                               return "#ff4d4f";
                                                            })(),
                                                            marginLeft: 8,
                                                            fontSize: 14,
                                                            fontWeight: 500,
                                                         }}
                                                      >
                                                         {(() => {
                                                            const bmi =
                                                               userData.weight /
                                                               Math.pow(
                                                                  userData.height /
                                                                     100,
                                                                  2
                                                               );
                                                            if (bmi < 18.5)
                                                               return "insuffisance pondérale";
                                                            if (bmi < 25)
                                                               return "normal";
                                                            if (bmi < 30)
                                                               return "surpoids";
                                                            return "obésité";
                                                         })()}
                                                      </Text>
                                                   </div>
                                                )}
                                          </div>
                                       </Card>
                                    </Col>

                                    {/* Medical Alerts Card */}
                                    <Col xs={24} lg={8}>
                                       <Card
                                          style={{
                                             height: "100%",
                                             borderRadius: 12,
                                             border: "1px solid #fa8c1615",
                                          }}
                                          bodyStyle={{ padding: 20 }}
                                       >
                                          <Title
                                             level={5}
                                             style={{
                                                margin: 0,
                                                marginBottom: 16,
                                                color: TEXT_DARK,
                                             }}
                                          >
                                             alertes médicales
                                          </Title>
                                          <div
                                             style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 16,
                                             }}
                                          >
                                             {userData.allergies &&
                                                userData.allergies.trim() && (
                                                   <div>
                                                      <Text
                                                         style={{
                                                            fontSize: 12,
                                                            color: TEXT_MEDIUM,
                                                            display: "block",
                                                            marginBottom: 4,
                                                         }}
                                                      >
                                                         allergies
                                                      </Text>
                                                      <Text
                                                         strong
                                                         style={{
                                                            fontSize: 18,
                                                            color: TEXT_DARK,
                                                         }}
                                                      >
                                                         {userData.allergies
                                                            .length > 80
                                                            ? userData.allergies.substring(
                                                                 0,
                                                                 80
                                                              ) + "..."
                                                            : userData.allergies}
                                                      </Text>
                                                   </div>
                                                )}
                                             {userData.chronicConditions &&
                                                userData.chronicConditions.trim() && (
                                                   <div>
                                                      <Text
                                                         style={{
                                                            fontSize: 12,
                                                            color: TEXT_MEDIUM,
                                                            display: "block",
                                                            marginBottom: 4,
                                                         }}
                                                      >
                                                         maladies chroniques
                                                      </Text>
                                                      <Text
                                                         strong
                                                         style={{
                                                            fontSize: 18,
                                                            color: TEXT_DARK,
                                                         }}
                                                      >
                                                         {userData
                                                            .chronicConditions
                                                            .length > 80
                                                            ? userData.chronicConditions.substring(
                                                                 0,
                                                                 80
                                                              ) + "..."
                                                            : userData.chronicConditions}
                                                      </Text>
                                                   </div>
                                                )}
                                             {userData.medications &&
                                                userData.medications.trim() && (
                                                   <div>
                                                      <Text
                                                         style={{
                                                            fontSize: 12,
                                                            color: TEXT_MEDIUM,
                                                            display: "block",
                                                            marginBottom: 4,
                                                         }}
                                                      >
                                                         médicaments
                                                      </Text>
                                                      <Text
                                                         strong
                                                         style={{
                                                            fontSize: 18,
                                                            color: TEXT_DARK,
                                                         }}
                                                      >
                                                         {userData.medications
                                                            .length > 80
                                                            ? userData.medications.substring(
                                                                 0,
                                                                 80
                                                              ) + "..."
                                                            : userData.medications}
                                                      </Text>
                                                   </div>
                                                )}
                                          </div>
                                       </Card>
                                    </Col>
                                 </Row>
                              </Card>
                           </Col>
                        )}
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
                           analyses
                        </Title>
                        <Text style={{ fontSize: 18, color: TEXT_MEDIUM }}>
                           fonctionnalité à venir
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


