const express = require("express");
const sql = require("mssql");
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require("cors");

const config = {
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true
  },
  port: 1433
};


app.use(cors());
app.use(express.json());


let pool;
(async () => {
  try {
    pool = await sql.connect(config);
    console.log("Connected to SQL Database");
  } catch (err) {
    console.error("Database Connection Error:", err);
    process.exit(1);
  }
})();


app.use((req, res, next) => {
  if (!pool) {
    return res.status(503).json({ error: "Database not connected" });
  }
  req.db = pool;
  next();
});

app.get("/test", (req, res) => {
  res.status(200).json({ message: "API working!" });
});

app.get("/users", async (req, res) => {
  try {
    const result = await req.db.request().query("SELECT * FROM users");
    res.json(result.recordset);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Test de connexion DB
app.get("/test-db", async (req, res) => {
  try {
    const result = await req.db.request().query("SELECT 1 AS test");
    res.json({ status: "OK", result: result.recordset });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});