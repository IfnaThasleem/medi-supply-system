import React from "react";
import { useNavigate } from "react-router-dom";
import "./Start.css";
import logo from "../assets/logo.PNG"; // ✅ Your medical logo

const Start = () => {
  const navigate = useNavigate();

  return (
    <div className="start-container">
      <div className="start-box">
        <img src={logo} alt="MediSupply Logo" className="logo" />
        <h1>MediSupply System</h1>
        <p> Trusted Medicine Distribution Agency </p>
        <div className="start-buttons">
          <button onClick={() => navigate("/register")}>Register</button>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Start;
