const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const db = require("../db");

const router = express.Router();

// ✅ Register
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
    const values = [username, email, hashedPassword, role];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("MySQL Insert Error:", err);
        return res.status(500).json({ message: "Registration failed" });
      }

      res.status(201).json({ message: "User registered successfully!" });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0) return res.status(401).json({ message: "Invalid username or password" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid username or password" });

    const token = "abc123"; // Replace with JWT if needed
    res.json({ message: "Login successful", token, role: user.role, userId: user.id });
  });
});


// ✅ Update Settings (username, email, password)
router.post("/update-settings", async (req, res) => {
  const { id, username, email, password } = req.body;

  if (!id || !username || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let sql, values;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      sql = "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
      values = [username, email, hashed, id];
    } else {
      sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
      values = [username, email, id];
    }

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Update Error:", err);
        return res.status(500).json({ message: "Update failed" });
      }

      res.json({ message: "Settings updated successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Upload Profile Picture
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ message: "File uploaded", filename: req.file.filename });
});

module.exports = router;
