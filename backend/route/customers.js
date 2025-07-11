const express = require("express");
const router = express.Router();
const db = require("../db");

// Add new customer
router.post("/", (req, res) => {
  console.log("Incoming request:", req.body);
  const { name, phone, email, address } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const sql = `
    INSERT INTO customers (name, phone, email, address)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, phone, email, address], (err, result) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({ message: "Customer added successfully!" });
  });
});

// Update existing customer
router.put("/:id", (req, res) => {
  const customerId = req.params.id;
  const { name, phone, email, address } = req.body;

  const sql = `
    UPDATE customers
    SET name = ?, phone = ?, email = ?, address = ?
    WHERE id = ?
  `;

  db.query(sql, [name, phone, email, address, customerId], (err, result) => {
    if (err) {
      console.error("Error updating customer:", err.message);
      return res.status(500).json({ error: "Failed to update customer" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully!" });
  });
});

// Soft delete a customer by ID
router.delete("/:id", (req, res) => {
  const customerId = req.params.id;

  const sql = `
    UPDATE customers
    SET is_deleted = 1, deleted_at = NOW()
    WHERE id = ?
  `;

  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error("Database error on soft delete:", err.message);
      return res.status(500).json({ error: "Database error while deleting customer" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer marked as unavailable." });
  });
});

// Get all customers
router.get("/", (req, res) => {
  const q = "SELECT * FROM customers WHERE is_deleted = 0 OR is_deleted IS NULL";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

module.exports = router;
