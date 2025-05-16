const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based MySQL client
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// MySQL configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/users', async (req, res) => {
    let connection;
    try {
        // Create a connection to the database
        connection = await mysql.createConnection(dbConfig);
        
        // Query the database
        const [users] = await connection.execute('SELECT * FROM users'); // Adjust the query as needed
        
        // Send the result as JSON
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        // Close the database connection
        if (connection) {
            await connection.end();
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
