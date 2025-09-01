import React, { useState } from "react";
import LoginPage from "./Login";
import SignupPage from "./Signup";
import "../styles/Auth.css";
import "../styles/Flipper.css";

export default function AuthCard({ onLogin }) {
   const [flipped, setFlipped] = useState(false);

   return (
      <div className="container">
         <div className="card-container ">
            <div className={`card ${flipped ? "flipped" : ""}`}>
               <div className="card-side card-front">
                  <LoginPage flip={() => setFlipped(true)} onLogin={onLogin} />
               </div>
               <div className="card-side card-back">
                  <SignupPage flip={() => setFlipped(false)} onLogin={onLogin} />
               </div>
            </div>
         </div>
      </div>
   );
}