import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import logo from "../assets/logo.PNG";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="logo" />
          <h2>MediAdmin</h2>
        </div>
        <nav>
          <ul>
            <li className="active" onClick={() => navigate("/dashboard")}>Dashboard</li>
            <li onClick={() => navigate("/inventory")}>Inventory</li>
            <li onClick={() => navigate("/employee")}>Employees</li>
            <li onClick={() => navigate("/orders")}>Orders</li>
            <li onClick={() => navigate("/payments")}>Payments</li>
            <li onClick={() => navigate("/reports")}>Reports</li>
            <li onClick={() => navigate("/settings")}>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="title">Dashboard</div>
          <div className="topbar-right">
            <span className="notification" onClick={() => navigate("/notification")}>🔔</span>
            <span className="user" onClick={() => navigate("/settings")}>👤 Admin</span>
            <button className="logout">Logout</button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Quick Stats */}
          <section className="quick-stats">
            <h3>Quick Stats</h3>
            <div className="stats-scroll">
              <div className="stat-card">📦 Total Medicines: 200</div>
              <div className="stat-card">🛒 Orders Today: 2</div>
              <div className="stat-card">👥 Active Employees: 4</div>
              <div className="stat-card">🚚 Pending Deliveries: 4</div>
              <div className="stat-card">💰 Monthly Revenue: Rs. 12,300</div>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="activity-feed">
            <h3>Recent Activity</h3>
            <div className="activity-scroll">
              <p>📤 [10:32 AM] Order ORD979136 dispatched</p>
              <p>👨‍💼 [10:10 AM] Employee "EMP1" logged in</p>
              <p>💊 [9:45 AM] Inventory updated for Paracetamol</p>
              <p>🆕 [9:00 AM] New order from Pharmacy ABC</p>
              <p>📄 [8:15 AM] Report generated for June</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
