import React, { useState } from "react";
import "./AdminDashboard.css";
import logo from "../assets/logo.PNG";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SettingsPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: localStorage.getItem("userId") || "", // or pass it via props/context
    username: "admin",
    email: "admin@example.com",
    password: "",
    confirmPassword: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/update-settings", form);
      setMessage("✅ " + res.data.message);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Update failed"));
    }
  };

  const handleUpload = async () => {
    if (!avatar) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/upload-avatar", formData);
      alert("✅ Uploaded: " + res.data.filename);
    } catch (err) {
      alert("❌ Upload failed");
    }
  };

  // --- Added logout handler ---
  const handleLogout = () => {
    // Clear localStorage or any session storage or tokens
    localStorage.clear();
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className={`admin-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="logo" />
          <h2>MediAdmin</h2>
        </div>
        <nav>
          <ul>
            <li onClick={() => navigate("/dashboard")}>Dashboard</li>
            <li onClick={() => navigate("/inventory")}>Inventory</li>
            <li onClick={() => navigate("/employee")}>Employees</li>
            <li onClick={() => navigate("/orders")}>Orders</li>
            <li onClick={() => navigate("/reports")}>Reports</li>
            <li className="active">Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="main">
        <header className="topbar">
          <div className="title">Settings</div>
          <div className="topbar-right">
            <span className="notification">🔔</span>
            <span className="user">👤 Admin</span>
            {/* Connect logout handler here */}
            <button className="logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="employee-content">
          <h2>Account Settings</h2>
          {message && <p style={{ marginBottom: "1rem" }}>{message}</p>}
          <form className="form-container" onSubmit={handleSettingsSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <button type="submit">💾 Save Settings</button>
          </form>

          <hr style={{ margin: "2rem 0" }} />

          <h3>Upload Profile Picture</h3>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>📤 Upload</button>

          <hr style={{ margin: "2rem 0" }} />

          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />{" "}
            🌙 Enable Dark Mode
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
