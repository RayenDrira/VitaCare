import React, { useState } from "react";
import LoginPage from "../components/Login"; // make sure the path is correct
import SignupPage from "../components/Signup";
import "../styles/Auth.css";
import "../styles/Flipper.css";

export default function AuthCard() {
   const [flipped, setFlipped] = useState(false);

   return (
      <div className="container">
         <div className="card-container ">
            <div className={`card ${flipped ? "flipped" : ""}`}>
               <div className="card-side card-front">
                  <LoginPage flip={() => setFlipped(true)} />
               </div>
               <div className="card-side card-back">
                  <SignupPage flip={() => setFlipped(false)} />
               </div>
            </div>
         </div>
      </div>
   );
}
