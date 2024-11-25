require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
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
    // Try both possible locations for the data file
    const buildPath = path.join(__dirname, 'build', 'data_19-24.json');
    const srcPath = path.join(__dirname, 'src', 'data_19-24.json');
    
    let dataPath;
    if (fs.existsSync(buildPath)) {
      console.log('Found data file in build directory');
      dataPath = buildPath;
    } else if (fs.existsSync(srcPath)) {
      console.log('Found data file in src directory');
      dataPath = srcPath;
    } else {
      throw new Error('Data file not found in either build or src directory');
    }
    
    console.log('Loading data from:', dataPath);
    const scheduleData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json(scheduleData);
  } catch (error) {
    console.error('Error loading schedule data:', error);
    console.error('Current directory structure:');
    try {
      const buildDir = path.join(__dirname, 'build');
      const srcDir = path.join(__dirname, 'src');
      if (fs.existsSync(buildDir)) {
        console.log('Build directory contents:', fs.readdirSync(buildDir));
      }
      if (fs.existsSync(srcDir)) {
        console.log('Src directory contents:', fs.readdirSync(srcDir));
      }
    } catch (e) {
      console.error('Error listing directories:', e);
    }
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
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Make sure data file exists in either build/ or src/ directory`);
});

module.exports = app;