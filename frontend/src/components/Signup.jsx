import React, { useState } from "react";
import Button from "./Button";

import "../styles/Auth.css";
import "../styles/Button.css";

import GoogleLogo from "../assets/google_logo.svg";
import Logo from "../assets/VitaCare_logo.png";

export default function SignupPage({ flip }) {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
         setError("Passwords do not match");
         return;
      }

      try {
         const res = await fetch("http://localhost:8081/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
         });

         if (!res.ok) throw new Error("Signup failed");

         const data = await res.json();
         console.log("JWT Response:", data);

         localStorage.setItem("jwt", data.token);
         window.location.href = "/dashboard";
      } catch (err) {
         setError("Failed to create account");
      }
   };

   const handleGoogleSignup = () => {
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

            <input
               type="password"
               name="confirmPassword"
               placeholder="Confirm Password"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               required
            />

            <Button variant="blue" type="submit">
               Sign up
            </Button>

            <div className="or">
               <hr /> <p>Or</p> <hr />
            </div>

            <Button type="button" variant="white" onClick={handleGoogleSignup}>
               <img src={GoogleLogo} alt="google_logo" />
               Sign up with Google
            </Button>

            <p id="new">
               Already have an account? &nbsp;
               <span onClick={flip} className="flip-clicker">
                  Sign in!
               </span>
            </p>
         </form>

         {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
   );
}
