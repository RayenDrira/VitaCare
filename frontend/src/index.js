import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// On cible la div root
const rootElement = document.getElementById("root");

// React 18 utilise createRoot
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);