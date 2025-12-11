import React from "react";
import { Layout } from "antd";
import Logo from "../../assets/VitaCare_logo.png";
import MenuItems from "./MenuItems";
import CollapseButton from "./CollapseButton";
import { COLORS } from "../../constants";

const { Sider } = Layout;
const { PRIMARY, SIDEBAR_BG, SIDEBAR_BORDER } = COLORS;

const Sidebar = ({
   collapsed,
   setCollapsed,
   activePage,
   setActivePage,
   siderItems,
}) => {
   return (
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
            display: "flex",
            flexDirection: "column",
         }}
      >
         {/* Logo Section */}
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

         {/* Menu Section */}
         <div
            style={{
               padding: "0 0px",
               flex: 1,
               display: "flex",
               flexDirection: "column",
            }}
         >
            <MenuItems
               collapsed={collapsed}
               activePage={activePage}
               setActivePage={setActivePage}
               siderItems={siderItems}
            />

            {/* Collapse Button */}
            <CollapseButton
               collapsed={collapsed}
               onClick={() => setCollapsed((prev) => !prev)}
            />
         </div>
      </Sider>
   );
};

export default Sidebar;
