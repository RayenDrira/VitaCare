import React from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { COLORS } from "../../constants";

const { GREY, TEXT_MEDIUM, SIDEBAR_BORDER } = COLORS;

const CollapseButton = ({ collapsed, onClick }) => {
   const handleMouseEnter = (e) => {
      e.target.style.background = "rgba(26,188,156,0.1)";
      e.target.style.transform = "none";
      // Change icon color to secondary
      const icon = e.target.querySelector(".anticon");
      if (icon) icon.style.color = "#1ABC9C";
      // Change text color to secondary
      const text = e.target.querySelector("span");
      if (text) text.style.color = "#1ABC9C";
   };

   const handleMouseLeave = (e) => {
      e.target.style.background = "transparent";
      e.target.style.transform = "none";
      // Reset icon color to grey
      const icon = e.target.querySelector(".anticon");
      if (icon) icon.style.color = "#B0B8C1";
      // Reset text color to original
      const text = e.target.querySelector("span");
      if (text) text.style.color = "#4B5C6B";
   };

   return (
      <div
         style={{
            position: "sticky",
            bottom: 0,
            padding: "8px",
            borderTop: `1px solid ${SIDEBAR_BORDER}`,
            background: "rgba(26,139,183,0.08)",
         }}
      >
         <Button
            type="text"
            onClick={onClick}
            className="no-highlight"
            icon={
               collapsed ? (
                  <RightOutlined
                     style={{
                        color: GREY,
                        fontSize: 20,
                        fontWeight: 700,
                        transition: "color 0.2s ease",
                     }}
                  />
               ) : (
                  <LeftOutlined
                     style={{
                        color: GREY,
                        fontSize: 20,
                        fontWeight: 700,
                        transition: "color 0.2s ease",
                     }}
                  />
               )
            }
            style={{
               display: "flex",
               alignItems: "center",
               justifyContent: collapsed ? "center" : "flex-start",
               paddingLeft: collapsed ? 0 : "24px",
               width: "100%",
               height: 40,
               borderRadius: "8px",
               background: "transparent",
               border: "none",
               transition: "all 0.2s ease",
               boxShadow: "none",
               outline: "none",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
         >
            {!collapsed && (
               <span
                  style={{
                     marginLeft: 8,
                     color: TEXT_MEDIUM,
                     fontWeight: 600,
                     fontSize: 14,
                     transition: "color 0.2s ease",
                  }}
               >
                  Réduire
               </span>
            )}
         </Button>
      </div>
   );
};

export default CollapseButton;
