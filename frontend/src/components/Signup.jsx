import React, { useState } from "react";
import Button from "./Button";

import "../styles/Auth.css";
import "../styles/Button.css";

import GoogleLogo from "../assets/google_logo.svg";
import Logo from "../assets/VitaCare_logo.png";

export default function SignupPage({ flip, onLogin }) {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");

   React.useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
         localStorage.setItem("jwt", token);
         if (onLogin) onLogin();
         window.history.replaceState(
            {},
            document.title,
            window.location.pathname
         );
      }
   }, [onLogin]);

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
         localStorage.setItem("jwt", data.token);

         if (onLogin) onLogin(); // <-- Notify parent
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

            <Button type="button" variant="teal" onClick={handleGoogleSignup}>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
               >
                  <g clip-path="url(#clip0_35_27)">
                     <path
                        d="M19.5312 10.2266C19.5312 15.7539 15.7461 19.6875 10.1562 19.6875C4.79688 19.6875 0.46875 15.3594 0.46875 10C0.46875 4.64062 4.79688 0.3125 10.1562 0.3125C12.7656 0.3125 14.9609 1.26953 16.6523 2.84766L14.0156 5.38281C10.5664 2.05469 4.15234 4.55469 4.15234 10C4.15234 13.3789 6.85156 16.1172 10.1562 16.1172C13.9922 16.1172 15.4297 13.3672 15.6562 11.9414H10.1562V8.60938H19.3789C19.4688 9.10547 19.5312 9.58203 19.5312 10.2266Z"
                        fill="#ffffff"
                     />
                  </g>
                  <defs>
                     <clipPath id="clip0_35_27">
                        <rect width="20" height="20" fill="white" />
                     </clipPath>
                  </defs>
               </svg>
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
