import React from "react";
import {
   DashboardOutlined,
   FileTextOutlined,
   BarChartOutlined,
} from "@ant-design/icons";

// Color palette
export const COLORS = {
   PRIMARY: "#1A8BB7",
   SECONDARY: "#1ABC9C",
   BG_LIGHT: "#F8FAFC",
   BG_CARD: "#fff",
   SIDEBAR_BG: "#F3F6F9",
   SIDEBAR_BORDER: "#E3E8EF",
   TEXT_DARK: "#22313F",
   TEXT_MEDIUM: "#4B5C6B",
   GREY: "#B0B8C1",
   WARNING: "#fa8c16",
};

// Page configuration
export const PAGE_TITLES = {
   1: { title: "Dashboard", subtitle: "Bienvenue sur VitaCare" },
   2: {
      title: "Analytics",
      subtitle: "Visualisez vos statistiques de santé",
   },
   9: {
      title: "Documents",
      subtitle: "Organisez et gérez tous vos documents médicaux",
   },
   10: {
      title: "Profil",
      subtitle: "Gérez vos informations personnelles",
   },
};

// Sidebar menu items configuration
export const SIDER_ITEMS = [
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
