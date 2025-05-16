const express = require('express');
const app = express();
const PORT = 3000;

// Serve static files (if needed)
app.use(express.static('public'));


app.get('/test', (req, res) => {
  res.status(200).json({ message: "Hello from Azure!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});