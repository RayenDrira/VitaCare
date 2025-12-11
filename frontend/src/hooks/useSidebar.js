import { useState } from "react";

/**
 * Custom hook for managing sidebar state
 */
export const useSidebar = () => {
   const [collapsed, setCollapsed] = useState(false);
   const [activePage, setActivePage] = useState("1");

   const toggleSidebar = () => setCollapsed((prev) => !prev);

   return {
      collapsed,
      setCollapsed,
      activePage,
      setActivePage,
      toggleSidebar,
   };
};

/**
 * Custom hook for managing hover effects
 */
export const useHover = () => {
   const [isHovered, setIsHovered] = useState(false);

   const handleMouseEnter = () => setIsHovered(true);
   const handleMouseLeave = () => setIsHovered(false);

   return {
      isHovered,
      handleMouseEnter,
      handleMouseLeave,
   };
};
