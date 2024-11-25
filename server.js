require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Log environment details
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('API_PORT:', process.env.API_PORT);

// Middleware
app.use(express.json());

// Enable CORS in development
if (process.env.NODE_ENV === 'development') {
  console.log('CORS enabled for development');
  app.use(cors());
}

// API endpoint to serve the schedule data
app.get('/api/schedule', (req, res) => {
  try {
    // In production, use path.join to handle file paths correctly
    const scheduleData = require(path.join(__dirname, process.env.NODE_ENV === 'production' ? 'build' : 'src', 'data_19-24.json'));
    res.json(scheduleData);
  } catch (error) {
    console.error('Error loading schedule data:', error);
    res.status(500).json({ error: 'Failed to load schedule data' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  console.log('Serving static files from:', path.join(__dirname, 'build'));
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 3000) : process.env.API_PORT;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;