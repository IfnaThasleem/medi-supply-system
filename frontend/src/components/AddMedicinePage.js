import React, { useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import logo from "../assets/logo.PNG";
import { useNavigate } from "react-router-dom";

const AddMedicinePage = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const availability = parseInt(form.quantity) > 0;

    try {
      await axios.post("http://localhost:5000/api/medicines", {
        name: form.name,
        quantity: form.quantity,
        price: form.price,
        available: availability,
      });

      alert("✅ Medicine added!");
      navigate("/inventory");
    } catch (error) {
      console.error("❌ Error adding medicine:", error);
      alert("Failed to add medicine. Check backend.");
    }
  };

  return (
    <div className="admin-container">
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
            <li onClick={() => navigate("/settings")}>Settings</li>
            <li className="active">Add Medicine</li>
          </ul>
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <img src={logo} alt="logo" className="topbar-logo" />
          </div>
          <div className="topbar-right">
            <span className="notification">🔔</span>
            <span className="user">👤 Admin</span>
            <button className="logout">Logout</button>
          </div>
        </header>

        <div className="employee-content">
          <h2>Add New Medicine</h2>
          <form className="form-container" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Medicine Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Stock Quantity"
              value={form.quantity}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price per 10 tablets"
              value={form.price}
              onChange={handleChange}
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicinePage;
