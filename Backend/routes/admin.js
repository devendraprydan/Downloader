const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const DownloadRecord = require('../models/DownloadRecord');
const Visitor = require('../models/Visitor');
const { adminAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, email: admin.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/admin/dashboard/stats - Protected
router.get('/dashboard/stats', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [
      totalVisitors,
      totalLinks,
      totalDownloads,
      successfulDownloads,
      failedDownloads,
      downloadsToday,
      downloadsThisWeek,
      youtubeCount,
      facebookCount,
      instagramCount,
      xCount
    ] = await Promise.all([
      Visitor.countDocuments(),
      DownloadRecord.countDocuments(),
      DownloadRecord.countDocuments(),
      DownloadRecord.countDocuments({ status: 'success' }),
      DownloadRecord.countDocuments({ status: 'failed' }),
      DownloadRecord.countDocuments({ createdAt: { $gte: startOfDay } }),
      DownloadRecord.countDocuments({ createdAt: { $gte: startOfWeek } }),
      DownloadRecord.countDocuments({ platform: 'YouTube' }),
      DownloadRecord.countDocuments({ platform: 'Facebook' }),
      DownloadRecord.countDocuments({ platform: 'Instagram' }),
      DownloadRecord.countDocuments({ platform: 'X' })
    ]);

    res.json({
      totalVisitors,
      totalLinks,
      totalDownloads,
      successfulDownloads,
      failedDownloads,
      downloadsToday,
      downloadsThisWeek,
      platforms: {
        youtube: youtubeCount,
        facebook: facebookCount,
        instagram: instagramCount,
        x: xCount
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats.' });
  }
});

// GET /api/admin/activity/recent - Protected
router.get('/activity/recent', adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const recentActivity = await DownloadRecord.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v');

    res.json({ activity: recentActivity });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity.' });
  }
});

// GET /api/admin/verify - Protected (check if token is valid)
router.get('/verify', adminAuth, (req, res) => {
  res.json({ valid: true, email: req.admin.email });
});

module.exports = router;
