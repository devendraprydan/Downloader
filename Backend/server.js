const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');
const trackingMiddleware = require('./middleware/tracking');
const adminRoutes = require('./routes/admin');
const downloaderRoutes = require('./routes/downloader');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Apply tracking middleware to all API routes
app.use('/api', trackingMiddleware);

// Ensure downloads directory exists
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Cleanup old downloads periodically (every 30 minutes)
setInterval(() => {
  const now = Date.now();
  const maxAge = 30 * 60 * 1000; // 30 minutes
  try {
    const files = fs.readdirSync(downloadsDir);
    files.forEach(file => {
      const filePath = path.join(downloadsDir, file);
      try {
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > maxAge) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned up old file: ${file}`);
        }
      } catch {
        // Skip files we can't access
      }
    });
  } catch (err) {
    console.error('Cleanup error:', err.message);
  }
}, 30 * 60 * 1000);

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api', downloaderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin routes: /api/admin/*`);
  console.log(`Downloader routes: /api/video-info, /api/video-download`);
});

module.exports = app;
