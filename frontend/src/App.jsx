import React, { useState, useEffect } from "react";
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
   useNavigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

function OAuth2RedirectHandler({ setIsAuthenticated }) {
   const navigate = useNavigate();

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
         localStorage.setItem("jwt", token);
         setIsAuthenticated(true);
         window.history.replaceState({}, document.title, "/");
         navigate("/", { replace: true });
      }
   }, [setIsAuthenticated, navigate]);

   return null;
}

function App() {
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   // Validate JWT on app load
   useEffect(() => {
      const token = localStorage.getItem("jwt");
      if (token) {
         try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp > currentTime) {
               setIsAuthenticated(true);
            } else {
               localStorage.removeItem("jwt"); // expired
               setIsAuthenticated(false);
            }
         } catch (e) {
            console.error("Invalid token", e);
            setIsAuthenticated(false);
         }
      }
   }, []);

   return (
      <Router>
         <Routes>
            <Route
               path="/login"
               element={
                  isAuthenticated ? (
                     <Navigate to="/" />
                  ) : (
                     <LoginPage onLogin={() => setIsAuthenticated(true)} />
                  )
               }
            />
            <Route
               path="/oauth2/redirect"
               element={
                  <OAuth2RedirectHandler
                     setIsAuthenticated={setIsAuthenticated}
                  />
               }
            />
            <Route
               path="/*"
               element={
                  isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
               }
            />
         </Routes>
      </Router>
   );
}

export default App;
