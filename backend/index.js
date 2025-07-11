const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "medi_supply"
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL");
});

// ✅ Import all routes
const authRoutes = require("./route/auth");
const orderRoutes = require("./route/addOrders");
const customerRoutes = require("./route/customers"); // <-- ADD THIS

// ✅ Use all routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes); // <-- ADD THIS

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Medicine API
app.post("/api/medicines", (req, res) => {
  const { name, quantity, price } = req.body;
  const available = quantity > 0;

  db.query(
    "INSERT INTO medicines (name, quantity, price, available) VALUES (?, ?, ?, ?)",
    [name, quantity, price, available],
    (err, result) => {
      if (err) {
        console.error("❌ Insert error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Medicine added!", id: result.insertId });
    }
  );
});

app.get("/api/medicines", (req, res) => {
  db.query("SELECT * FROM medicines", (err, results) => {
    if (err) {
      console.error("❌ Fetch error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
