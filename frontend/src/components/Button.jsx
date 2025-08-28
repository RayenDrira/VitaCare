// src/components/Button.jsx
import React from "react";
import "../styles/Button.css";

export default function Button({ children, variant, onClick, type = "button" }) {
  // The className depends on the variant prop
  const className = variant ? `btx-${variant}` : "btx-red";

  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}
