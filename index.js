const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const mysql = require("mysql2/promise"); // Utilisation de la version promise

// Middleware
app.use(cors());
app.use(express.json());

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: 3306, // Port par défaut MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false } // Nécessaire pour Azure
};

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Test endpoint
app.get("/test", (req, res) => {
  res.status(200).json({ message: "API working!" });
});

// Get all users
app.get("/users", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database connection failed" });
  } finally {
    if (connection) connection.release();
  }
});

// Test de connexion à la base de données
app.get("/test-db", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ status: "Database connection successful" });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});