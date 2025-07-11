import React from "react";
import jsPDF from "jspdf";
import "./AdminDashboard.css";

const PaymentsPage = () => {
  const invoices = [
    { id: "INV001", pharmacy: "Pharmacy A", amount: "Rs. 1200", method: "UPI", date: "2025-06-01" },
    { id: "INV002", pharmacy: "Pharmacy B", amount: "Rs. 800", method: "COD", date: "2025-06-01" },
    { id: "INV003", pharmacy: "Pharmacy C", amount: "Rs. 600", method: "Google Pay", date: "2025-06-01" },
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("MediSupply Invoice Report", 14, 20);

    // Table Headers
    doc.setFontSize(12);
    const headers = ["Invoice ID", "Pharmacy", "Amount", "Payment Method", "Date"];
    let startY = 30;
    headers.forEach((header, i) => {
      doc.text(header, 14 + i * 35, startY);
    });

    // Table Rows
    invoices.forEach((inv, rowIndex) => {
      const rowY = startY + (rowIndex + 1) * 10;
      doc.text(inv.id, 14, rowY);
      doc.text(inv.pharmacy, 49, rowY);
      doc.text(inv.amount, 84, rowY);
      doc.text(inv.method, 119, rowY);
      doc.text(inv.date, 154, rowY);
    });

    doc.save("invoice_report.pdf");
  };

  return (
    <div className="admin-container">
      <div className="main">
        <header className="topbar">
          <div className="title">Payments</div>
          <div className="topbar-right">
            <span className="notification">🔔</span>
            <span className="user">👤 Admin</span>
            <button className="logout">Logout</button>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="quick-stats">
            <h3>💳 Manage Payments</h3>
            <div className="stats-scroll">
              <div className="stat-card">🧾 Pending Invoices: 5</div>
              <div className="stat-card">✅ Completed Payments: 12</div>
              <div className="stat-card">💰 Total Received: Rs. 45,600</div>
            </div>
          </section>

          <section className="quick-stats">
            <h3>📄 Download Invoice Report</h3>
            <button className="download-btn" onClick={downloadPDF}>
              📥 Download PDF
            </button>
          </section>

          <section className="quick-stats">
            <h3>🧾 Select Payment Method</h3>
            <div className="stats-scroll">
              <select style={{ padding: "8px", width: "200px", fontSize: "16px" }}>
                <option>UPI</option>
                <option>Google Pay</option>
                <option>PhonePe</option>
                <option>Paytm</option>
                <option>Cash on Delivery (COD)</option>
              </select>
              <p style={{ marginTop: "10px" }}>
                Account Name: <strong>MediSupply</strong>
              </p>
              <p>Account Number: <strong>1234567890</strong></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
