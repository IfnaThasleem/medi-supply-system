const express = require("express");
const router = express.Router();
const db = require("../db");

// Add new order
router.post("/", (req, res) => {
  const { order_id, customer_id, medicine_name, quantity, total_amount } = req.body;

  if (!order_id || !customer_id || !medicine_name || !quantity || !total_amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO orders (order_id, customer_id, medicine_name, quantity, total_amount)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [order_id, customer_id, medicine_name, quantity, total_amount], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Order added successfully!" });
  });
});

// Get latest order ID and generate next ID
router.get("/latest-id", (req, res) => {
  const sql = "SELECT order_id FROM orders ORDER BY id DESC LIMIT 1";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.json({ nextId: "ORD001" });
    }

    const lastId = result[0].order_id; // e.g. "ORD007"
    const num = parseInt(lastId.replace("ORD", ""), 10) + 1;
    const nextId = `ORD${String(num).padStart(3, "0")}`;

    res.json({ nextId });
  });
});

// Fetch all orders
router.get("/", (req, res) => {
  const sql = "SELECT * FROM orders ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// Update an order
router.put("/:order_id", (req, res) => {
  const { order_id } = req.params;
  const { medicine_name, quantity, total_amount } = req.body;

  if (!medicine_name || !quantity || !total_amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    UPDATE orders
    SET medicine_name = ?, quantity = ?, total_amount = ?
    WHERE order_id = ?
  `;

  db.query(sql, [medicine_name, quantity, total_amount, order_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully" });
  });
});

// Mark order as cancelled (soft delete)
router.delete("/:order_id", (req, res) => {
  const { order_id } = req.params;

  const sql = `
    UPDATE orders
    SET status = 'Cancelled'
    WHERE order_id = ?
  `;

  db.query(sql, [order_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order cancelled successfully" });
  });
});

// GET /api/orders/:id
router.get("/:id", (req, res) => {
  const orderId = req.params.id;
  const sql = "SELECT * FROM orders WHERE id = ?";
  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error("DB error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(result[0]);
  });
});

// Get orders for a specific customer
router.get("/customer/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const sql = `
    SELECT o.*, m.name AS medicine_name
    FROM orders o
    JOIN medicines m ON o.medicine_id = m.id
    WHERE o.customer_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error("Error fetching orders for customer:", err.message);
      return res.status(500).json({ error: "Failed to fetch customer orders" });
    }
    res.json(results);
  });
});


module.exports = router;
