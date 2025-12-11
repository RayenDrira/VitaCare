import React from "react";
import { Menu } from "antd";
import { COLORS } from "../../constants";

const { PRIMARY, GREY, TEXT_MEDIUM } = COLORS;

const MenuItems = ({
   collapsed,
   activePage,
   setActivePage,
   siderItems = [],
}) => {
   return (
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
                  transform: collapsed ? "translateX(-3px)" : undefined,
               },
            }),
            label: (
               <span
                  style={{
                     color: activePage === item.key ? PRIMARY : TEXT_MEDIUM,
                     fontWeight: activePage === item.key ? 600 : 500,
                     letterSpacing: "0.2px",
                     fontSize: 16,
                     transition: "color 0.2s",
                  }}
               >
                  {item.label}
               </span>
            ),
            style: {
               margin: "8px 8px 8px 8px",
               borderRadius: "8px",
               background:
                  activePage === item.key
                     ? "rgba(26,139,183,0.08)"
                     : "transparent",
               border:
                  activePage === item.key
                     ? "1px solid rgba(26,139,183,0.2)"
                     : "1px solid transparent",
               color: activePage === item.key ? PRIMARY : TEXT_MEDIUM,
               transition: "all 0.2s ease",
               textAlign: collapsed ? "center" : "left",
            },
         }))}
         onClick={(e) => setActivePage(e.key)}
         style={{
            background: "transparent",
            border: "none",
            fontSize: "15px",
            fontWeight: 500,
            flex: 1,
            padding: 0,
         }}
         theme="light"
      />
   );
};

export default MenuItems;
