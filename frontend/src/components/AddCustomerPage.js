import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AddCustomerPage = () => {
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  

  const handleAddCustomer = async () => {
    try {
      await axios.post("http://localhost:5000/api/customers", newCustomer);
      alert("Customer added successfully!");
      navigate("/orders");
    } catch (err) {
      alert("Error adding customer.");
      console.error("Error adding customer:", err);
    }
  };

  return (
    <div className="form-section">
      <h2>Add New Customer</h2>
      <input name="name" value={newCustomer.name} onChange={handleCustomerChange} placeholder="Name" />
      <input name="phone" value={newCustomer.phone} onChange={handleCustomerChange} placeholder="Phone" />
      <input name="email" value={newCustomer.email} onChange={handleCustomerChange} placeholder="Email" />
      <input name="address" value={newCustomer.address} onChange={handleCustomerChange} placeholder="Address" />
      <button onClick={handleAddCustomer}>➕ Add Customer</button>
    </div>
  );
};

export default AddCustomerPage;
