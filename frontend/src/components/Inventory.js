import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import logo from "../assets/logo.PNG";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/medicines");
        setMedicines(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch medicines:", error);
      }
    };
    fetchMedicines();
  }, []);

  const filteredData = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setMedicines(medicines.filter((med) => med.id !== id));
    // Optional: Send delete request to backend
  };

  const handleEditClick = (medicine) => {
    setEditId(medicine.id);
    setEditValues({
      name: medicine.name,
      quantity: medicine.quantity,
      price: medicine.price,
    });
  };

  const handleChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    const updatedList = medicines.map((med) =>
      med.id === id ? { ...med, ...editValues } : med
    );
    setMedicines(updatedList);
    setEditId(null);

    try {
      await axios.put(`http://localhost:5000/api/medicines/${id}`, editValues);
    } catch (error) {
      console.error("Failed to update medicine:", error);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="MediAdmin Logo" />
          <h2>MediAdmin</h2>
        </div>
        <nav>
          <ul>
            <li onClick={() => navigate("/dashboard")}>Dashboard</li>
            <li className="active" onClick={() => navigate("/inventory")}>Inventory</li>
            <li onClick={() => navigate("/orders")}>Orders</li>
            <li onClick={() => navigate("/reports")}>Reports</li>
            <li onClick={() => navigate("/settings")}>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main">
        <header className="topbar">
          <div className="title">Inventory</div>
          <div className="topbar-right">
            <span className="notification">🔔</span>
            <span className="user">👤 {localStorage.getItem("role")}</span>
            <button className="logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="inventory-content">
          <div className="inventory-header">
            <h2>Medicine Inventory</h2>
            <div className="inventory-actions">
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="add-button" onClick={() => navigate("/add-medicine")}>
                + Add Medicine
              </button>
            </div>
          </div>

          <table className="inventory-table">
            <thead>
              <tr>
                <th>Medicine ID</th>
                <th>Name</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((med) => (
                  <tr key={med.id}>
                    <td>{med.id}</td>
                    <td>
                      {editId === med.id ? (
                        <input
                          type="text"
                          name="name"
                          value={editValues.name}
                          onChange={handleChange}
                        />
                      ) : (
                        med.name
                      )}
                    </td>
                    <td>
                      {editId === med.id ? (
                        <input
                          type="number"
                          name="quantity"
                          value={editValues.quantity}
                          onChange={handleChange}
                        />
                      ) : (
                        med.quantity
                      )}
                    </td>
                    <td>
                      {editId === med.id ? (
                        <input
                          type="number"
                          name="price"
                          value={editValues.price}
                          onChange={handleChange}
                        />
                      ) : (
                        med.price
                      )}
                    </td>
                    <td>
                      <span className={med.available ? "available" : "unavailable"}>
                        {med.available ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td>
                      {editId === med.id ? (
                        <button className="save-btn" onClick={() => handleSave(med.id)}>
                          💾 Save
                        </button>
                      ) : (
                        <button className="edit-btn" onClick={() => handleEditClick(med)}>
                          ✏️ Edit
                        </button>
                      )}
                      <button className="delete-btn" onClick={() => handleDelete(med.id)}>
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No medicines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
