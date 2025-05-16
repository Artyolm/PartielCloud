const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based MySQL client
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// MySQL configuration
const dbConfig = {
    host: 'your_host', // Replace with your MySQL host
    user: 'your_user', // Replace with your MySQL user
    password: 'your_password', // Replace with your MySQL password
    database: 'your_database' // Replace with your MySQL database name
};

app.get('/users', async (req, res) => {
    let connection;
    try {
         res.send('<h1>Hello, this is a test!</h1><p>Your server is working.</p>');
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
