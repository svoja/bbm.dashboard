require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());

// Environment-based logging
console.log('Starting server with:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('Current directory:', __dirname);

// CORS configuration
if (process.env.NODE_ENV === 'development') {
  console.log('Enabling CORS for development');
  app.use(cors());
} else {
  console.log('Production mode: Setting up static file serving');
}

// API Routes
app.get('/api/schedule', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 
      process.env.NODE_ENV === 'production' ? 'build' : 'src', 
      'data_19-24.json'
    );
    console.log('Loading data from:', dataPath);
    
    const scheduleData = require(dataPath);
    res.json(scheduleData);
  } catch (error) {
    console.error('Error loading schedule data:', error);
    console.error('Error details:', {
      message: error.message,
      path: path.join(__dirname, 
        process.env.NODE_ENV === 'production' ? 'build' : 'src', 
        'data_19-24.json'
      )
    });
    res.status(500).json({ 
      error: 'Failed to load schedule data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Static file serving for production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'build');
  console.log('Serving static files from:', buildPath);
  
  // Serve static files
  app.use(express.static(buildPath));
  
  // SPA fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Port configuration
const PORT = process.env.NODE_ENV === 'production' 
  ? (process.env.PORT || 3000)
  : (process.env.API_PORT || 3001);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/schedule`);
});

module.exports = app;