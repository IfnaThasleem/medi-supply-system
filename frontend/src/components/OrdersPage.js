import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newOrder, setNewOrder] = useState({
    customer_id: "",
    medicine_name: "",
    quantity: "",
    price: "",
    order_date: "",
  });

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingData, setEditingData] = useState({});

  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editingCustomerData, setEditingCustomerData] = useState({});

  const [deletingCustomerId, setDeletingCustomerId] = useState(null);

  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrder = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/latest-id");
      const order_id = res.data.nextId;
      const localDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
      const total_amount = parseFloat(newOrder.price) * parseInt(newOrder.quantity);

      const orderData = {
        order_id,
        customer_id: parseInt(newOrder.customer_id),
        medicine_name: newOrder.medicine_name,
        quantity: parseInt(newOrder.quantity),
        total_amount: total_amount.toFixed(2),
        order_date: localDateTime,
      };

      await axios.post("http://localhost:5000/api/orders", orderData);
      alert("Order added successfully!");
      fetchOrders();
      setNewOrder({
        customer_id: "",
        medicine_name: "",
        quantity: "",
        price: "",
        order_date: "",
      });
    } catch (err) {
      alert("Error adding order.");
      console.error("Error adding order:", err.response?.data || err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      fetchOrders();
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  const handleEditClick = (order) => {
    setEditingOrderId(order.order_id);
    setEditingData({
      medicine_name: order.medicine_name,
      quantity: order.quantity,
      price: (order.total_amount / order.quantity).toFixed(2),
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (order_id) => {
    try {
      const quantity = parseInt(editingData.quantity);
      const price = parseFloat(editingData.price);
      if (!editingData.medicine_name || isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
        alert("Please enter valid data.");
        return;
      }
      const total_amount = (price * quantity).toFixed(2);

      const updatedOrder = {
        medicine_name: editingData.medicine_name,
        quantity,
        total_amount,
      };

      await axios.put(`http://localhost:5000/api/orders/${order_id}`, updatedOrder);
      alert("Order updated successfully!");
      fetchOrders();
      setEditingOrderId(null);
      setEditingData({});
    } catch (err) {
      alert("Error updating order.");
      console.error("Error updating order:", err.response?.data || err);
    }
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setEditingData({});
  };

  const handleEditCustomerClick = (customer) => {
    setEditingCustomerId(customer.id);
    setEditingCustomerData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    });
  };

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveCustomer = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/customers/${id}`, editingCustomerData);
      alert("Customer updated successfully!");
      setEditingCustomerId(null);
      setEditingCustomerData({});
      fetchCustomers();
    } catch (err) {
      alert("Error updating customer.");
      console.error(err);
    }
  };

  const handleCancelCustomerEdit = () => {
    setEditingCustomerId(null);
    setEditingCustomerData({});
  };

  const handleDeleteCustomer = async (id) => {
    setDeletingCustomerId(id);
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      alert("Customer deleted successfully!");
      fetchCustomers();
    } catch (err) {
      alert("Error deleting customer");
      console.error(err);
    } finally {
      setDeletingCustomerId(null);
    }
  };

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Medicine</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Date</th>
            <th>Status</th>
            {role === "employee" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isCancelled = order.status === "Cancelled";
            return (
              <tr key={order.order_id} className={isCancelled ? "cancelled-row" : ""}>
                <td>{order.order_id}</td>
                <td>{order.customer_id}</td>
                {editingOrderId === order.order_id ? (
                  <>
                    <td><input name="medicine_name" value={editingData.medicine_name} onChange={handleEditChange} /></td>
                    <td><input name="quantity" type="number" value={editingData.quantity} onChange={handleEditChange} /></td>
                    <td><input name="price" type="number" value={editingData.price} onChange={handleEditChange} /></td>
                  </>
                ) : (
                  <>
                    <td>{order.medicine_name}</td>
                    <td>{order.quantity}</td>
                    <td>{(order.total_amount / order.quantity).toFixed(2)}</td>
                  </>
                )}
                <td>{order.order_date}</td>
                <td>{order.status || "active"}</td>
                {role === "employee" && (
                  <td>
                    {editingOrderId === order.order_id ? (
                      <>
                        <button className="save-btn" onClick={() => handleSaveEdit(order.order_id)}>Save</button>
                        <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn" onClick={() => handleEditClick(order)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteOrder(order.order_id)}>Cancel</button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {role === "employee" && (
        <div className="form-section">
          <h3>Add New Order</h3>
          <input name="customer_id" value={newOrder.customer_id} onChange={handleChange} placeholder="Customer ID" />
          <input name="medicine_name" value={newOrder.medicine_name} onChange={handleChange} placeholder="Medicine Name" />
          <input name="quantity" value={newOrder.quantity} onChange={handleChange} placeholder="Quantity" />
          <input name="price" value={newOrder.price} onChange={handleChange} placeholder="Price" />
          <input name="order_date" type="date" value={newOrder.order_date} onChange={handleChange} />
          <button onClick={handleAddOrder}>➕ Add Order</button>
        </div>
      )}

      <div className="customers-section">
        <h2>Customers</h2>
        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.id}>
                <td>{cust.id}</td>
                {editingCustomerId === cust.id ? (
                  <>
                    <td><input name="name" value={editingCustomerData.name} onChange={handleCustomerInputChange} /></td>
                    <td><input name="phone" value={editingCustomerData.phone} onChange={handleCustomerInputChange} /></td>
                    <td><input name="email" value={editingCustomerData.email} onChange={handleCustomerInputChange} /></td>
                    <td><input name="address" value={editingCustomerData.address} onChange={handleCustomerInputChange} /></td>
                    <td>
                      <button className="save-btn" onClick={() => handleSaveCustomer(cust.id)}>Save</button>
                      <button className="cancel-btn" onClick={handleCancelCustomerEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{cust.name}</td>
                    <td>{cust.phone}</td>
                    <td>{cust.email}</td>
                    <td>{cust.address}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditCustomerClick(cust)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteCustomer(cust.id)} disabled={deletingCustomerId === cust.id}>
                        {deletingCustomerId === cust.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {role === "employee" && (
          <div className="form-section">
            <button onClick={() => navigate("/add-customer")}>➕ Add New Customer</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
