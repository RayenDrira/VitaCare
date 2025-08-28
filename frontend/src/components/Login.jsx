import React, { useState } from "react";
import Button from "./Button";

import "../styles/Auth.css";
import "../styles/Button.css";

import GoogleLogo from "../assets/google_logo.svg";
import Logo from "../assets/VitaCare_logo.png";

export default function LoginPage({ flip }) {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const res = await fetch("http://localhost:8081/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
         });

         if (!res.ok) throw new Error("Login failed");

         const data = await res.json();
         console.log("JWT Response:", data);

         // store JWT in localStorage (or cookie if you prefer)
         localStorage.setItem("jwt", data.token);
      } catch (err) {
         setError("Invalid email or password");
      }
   };

   const handleGoogleLogin = () => {
      // Redirect to your Spring Boot OAuth2 endpoint
      window.location.href = "http://localhost:8081/oauth2/authorize/google";
   };

   return (
      <div className="glassy-card">
         <div className="logo-container">
            <img src={Logo} className="logo-img" alt="VitaCare Logo" />
            <h1>VitaCare</h1>
         </div>

         <form onSubmit={handleSubmit}>
            <input
               type="email"
               name="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
            />

            <input
               type="password"
               name="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
            />

            <div className="forgot-password">
               <a href="#">Forgot password</a>
            </div>

            <Button variant="blue" type="submit">
               Sign in
            </Button>

            <div className="or">
               <hr />
               <p>Or</p>
               <hr />
            </div>

            <Button type="button" variant="white" onClick={handleGoogleLogin}>
               <img src={GoogleLogo} alt="google_logo" />
               Sign in with Google
            </Button>

            <p id="new">
               New to VitaCare? &nbsp;
               <span onClick={flip} className="flip-clicker">
                  Join Now!
               </span>
            </p>
         </form>

         {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
   );
}
