import React, { useState } from "react";
import GestionDocuments from "../components/Documents";
import GestionProfile from "../components/GestionProfile";
import "../styles/Dashboard.css";
import Logo from "../assets/VitaCare_logo.png";

import {
   Layout,
   Menu,
   Breadcrumb,
   ConfigProvider,
   Card,
   Typography,
} from "antd";
import {
   DesktopOutlined,
   FileOutlined,
   PieChartOutlined,
   TeamOutlined,
   UserOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export default function Dashboard() {
   const [collapsed, setCollapsed] = useState(false);
   const [activeTopMenu, setActiveTopMenu] = useState("1");

   const siderItems = [
      { key: "1", icon: <PieChartOutlined />, label: "Dashboard" },
      { key: "2", icon: <DesktopOutlined />, label: "Analytics" },
      {
         key: "sub1",
         icon: <UserOutlined />,
         label: "Users",
         children: [
            { key: "3", label: "Tom" },
            { key: "4", label: "Bill" },
            { key: "5", label: "Alex" },
         ],
      },
      {
         key: "sub2",
         icon: <TeamOutlined />,
         label: "Teams",
         children: [
            { key: "6", label: "Team 1" },
            { key: "8", label: "Team 2" },
         ],
      },
      { key: "9", icon: <FileOutlined />, label: "Documents" },
   ];

   return (
      <ConfigProvider
         theme={{
            token: {
               colorPrimary: "#31c1e1",
               borderRadius: 12,
            },
         }}
      >
         <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
            <Sider
               collapsible
               collapsed={collapsed}
               onCollapse={setCollapsed}
               style={{ background: "#001529" }}
            >
               <div
                  className="dashboard-logo"
                  style={{
                     height: 60,
                     margin: 16,
                     color: "#31c1e1",
                     fontWeight: "bold",
                     fontSize: 18,
                     textAlign: "center",
                     lineHeight: "60px",
                     background: "rgba(255, 255, 255, 0.1)",
                     borderRadius: 12,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     gap: 8,
                  }}
               >
                  <img src={Logo} style={{ width: 30, height: 30 }} alt="" />
                  VitaCare
               </div>
               <Menu
                  theme="dark"
                  defaultSelectedKeys={["1"]}
                  mode="inline"
                  items={siderItems}
               />
            </Sider>

            <Layout>
               <Header
                  style={{
                     background: "#fff",
                     padding: "0 24px",
                     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
               >
                  <Menu
                     mode="horizontal"
                     selectedKeys={[activeTopMenu]}
                     onClick={(e) => setActiveTopMenu(e.key)}
                     style={{ borderBottom: "none", fontWeight: "500" }}
                  >
                     <Menu.Item key="1">Accueil</Menu.Item>
                     <Menu.Item key="2">Documents</Menu.Item>
                     <Menu.Item key="3">Profil</Menu.Item>
                  </Menu>
               </Header>

               <Content style={{ margin: "16px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  {activeTopMenu === "1" && (
                     <Card
                        style={{
                           padding: 24,
                           minHeight: 400,
                           background: "#fff",
                           borderRadius: 12,
                           boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        }}
                     >
                        <div style={{ textAlign: "center", marginTop: 50 }}>
                           <Title level={2}>
                              Welcome to VitaCare Dashboard
                           </Title>
                           <p style={{ fontSize: 16, color: "#555" }}>
                              Manage your profile, documents, and analytics
                              easily.
                           </p>
                        </div>
                     </Card>
                  )}

                  {activeTopMenu === "2" && (
                     <Card
                        style={{
                           padding: 24,
                           minHeight: 400,
                           background: "#fff",
                           borderRadius: 12,
                           boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        }}
                     >
                        <GestionDocuments />
                     </Card>
                  )}

                  {activeTopMenu === "3" && <GestionProfile />}
               </Content>
            </Layout>
         </Layout>
      </ConfigProvider>
   );
}
