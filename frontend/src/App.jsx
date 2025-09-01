import React, { useState, useEffect } from "react";
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
   useNavigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

// Handler for Google OAuth redirect
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

   return null; // Optionally, show a loading spinner here
}

function App() {
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   // Check for JWT token on app load
   useEffect(() => {
      const token = localStorage.getItem("jwt");
      if (token) {
         setIsAuthenticated(true);
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
