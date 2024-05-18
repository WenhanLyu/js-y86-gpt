const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();  // Load environment variables from .env file
const translateRoute = require('./routes/translate');
const explainRoute = require('./routes/explain');

const app = express();
app.use(express.json());

// Serve static files directly from the root of the project
app.use(express.static(path.join(__dirname, '../'))); // Adjusted to serve from the project root

// Setup API routes
app.use('/api/translate', require('./routes/translate'));
app.use('/api/explain', require('./routes/explain'));

// Fallback route handler for any other GET requests not handled by the above
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../index.html')); // Ensures all other paths serve the index.html file
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
