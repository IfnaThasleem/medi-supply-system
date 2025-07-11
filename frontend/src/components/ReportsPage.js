import React from "react";
import "./AdminDashboard.css";
import logo from "../assets/logo.PNG";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const ReportsPage = () => {
  const navigate = useNavigate();

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Monthly Sales Report", 20, 20);

    doc.setFontSize(12);
    doc.text("Total Orders: 1,243", 20, 40);
    doc.text("Total Revenue: Rs. 345,000", 20, 50);
    doc.text("Top Product: Paracetamol", 20, 60);
    doc.text("Best Pharmacy: LifeLine Medicals", 20, 70);
    doc.text("Monthly Growth: +18%", 20, 80);
    doc.text("Generated on: " + new Date().toLocaleDateString(), 20, 100);

    doc.save("Monthly_Sales_Report.pdf");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="MediAdmin Logo" />
          <h2>MediAdmin</h2>
        </div>
        <nav>
          <ul>
            <li onClick={() => navigate("/dashboard")}>Dashboard</li>
            <li onClick={() => navigate("/inventory")}>Inventory</li>
            <li onClick={() => navigate("/employee")}>Employees</li>
            <li onClick={() => navigate("/orders")}>Orders</li>
            <li className="active">Reports</li>
            <li onClick={() => navigate("/settings")}>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="title">Reports</div>
          <div className="topbar-right">
            <span className="notification">🔔</span>
            <span className="user">👤 Admin</span>
            <button className="logout">Logout</button>
          </div>
        </header>

        {/* Reports Content */}
        <div className="dashboard-content">
          {/* Sales Report */}
          <section className="quick-stats">
            <div className="report-header">
              <h3>Sales Report</h3>
              <button className="download-btn" onClick={downloadPDF}>
                📄 Download PDF
              </button>
            </div>
            <div className="stats-scroll">
              <div className="stat-card">Total Orders: 1,243</div>
              <div className="stat-card">Total Revenue: Rs. 345,000</div>
              <div className="stat-card">Top Product: Paracetamol</div>
              <div className="stat-card">Best Pharmacy: LifeLine Medicals</div>
              <div className="stat-card">Monthly Growth: +18%</div>
            </div>
          </section>

          {/* Inventory Report */}
          <section className="activity-feed">
            <h3>Inventory Report</h3>
            <div className="activity-scroll">
              <p>Amoxicillin stock low - 12 packs remaining</p>
              <p>Ibuprofen out of stock</p>
              <p>New batch of Cough Syrup added - 150 units</p>
              <p>Expired stock removed - 5 products</p>
              <p>Stock audit completed - April 2025</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
