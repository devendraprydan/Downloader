const express = require('express');
const path = require('path');
const fs = require('fs');
const { detectPlatform, extractYouTubeId, isValidUrl } = require('../utils/platformDetector');
const { findYtDlpPath, getVideoInfo, downloadVideo, safeDelete } = require('../utils/ytDlp');
const DownloadRecord = require('../models/DownloadRecord');

const router = express.Router();

// Ensure downloads directory exists
const downloadsDir = path.join(__dirname, '..', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// GET /api/video-info?url=...&platform=...
router.get('/video-info', async (req, res) => {
  const { url } = req.query;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Please provide a valid URL.' });
  }

  const platform = detectPlatform(url);
  if (!platform) {
    return res.status(400).json({
      error: 'Unsupported URL. Please provide a YouTube, Facebook, Instagram, or X (Twitter) video link.'
    });
  }

  const visitorId = req.visitorId || 'unknown';

  try {
    const ytDlpPath = findYtDlpPath();
    if (!ytDlpPath) {
      return res.status(500).json({
        error: 'Video download service is not configured. Please contact the administrator.'
      });
    }

    const info = await getVideoInfo(url, ytDlpPath);

    // Extract available formats/qualities
    const formats = [];
    if (info.formats) {
      const videoFormats = info.formats.filter(f => f.vcodec !== 'none' && f.height);
      const uniqueHeights = [...new Set(videoFormats.map(f => f.height))].sort((a, b) => b - a);
      uniqueHeights.forEach(h => {
        formats.push({ quality: `${h}p`, value: h });
      });
    }

    // Always include standard quality options so users can choose,
    // even if the API didn't report all available formats.
    // yt-dlp's format string handles finding the actual best match.
    const standardQualities = [
      { quality: '1080p', value: 1080 },
      { quality: '720p', value: 720 },
      { quality: '480p', value: 480 },
      { quality: '360p', value: 360 },
    ];

    // Merge: add standard options that weren't already found
    const existingValues = new Set(formats.map(f => f.value));
    standardQualities.forEach(sq => {
      if (!existingValues.has(sq.value)) {
        formats.push(sq);
      }
    });

    // If no formats at all, add defaults
    if (formats.length === 0) {
      formats.push(
        { quality: '720p', value: 720 },
        { quality: '480p', value: 480 },
        { quality: '360p', value: 360 }
      );
    }

    const videoTitle = info.title || 'Unknown Video';
    const thumbnail = info.thumbnail || info.thumbnails?.[info.thumbnails.length - 1]?.url || null;
    const duration = info.duration || 0;

    // Log this request
    DownloadRecord.create({
      visitorId,
      platform,
      url,
      videoTitle,
      quality: formats[0]?.quality || 'best',
      status: 'pending'
    }).catch(err => console.error('Download record creation error:', err.message));

    res.json({
      videoInfo: {
        title: videoTitle,
        thumbnailUrl: thumbnail,
        duration,
        platform,
        formats,
        defaultQuality: formats[0]?.value || 'best'
      }
    });
  } catch (error) {
    console.error('Video info error:', error.message);

    let userMessage = 'Failed to fetch video information.';
    if (error.message.includes('timed out')) {
      userMessage = 'Request timed out. The video may be unavailable or the URL is invalid.';
    } else if (error.message.includes('Video unavailable')) {
      userMessage = 'This video is unavailable or has been removed.';
    } else if (error.message.includes('Private video')) {
      userMessage = 'This video is private and cannot be accessed.';
    } else if (error.message.includes('Sign in') && error.message.includes('bot')) {
      userMessage = 'YouTube is blocking this request. Try opening the video in your browser first, then try again.';
    } else if (error.message.includes('Sign in')) {
      userMessage = 'This video requires login or age verification and cannot be downloaded automatically.';
    } else if (error.message.includes('members-only') || error.message.includes('members only')) {
      userMessage = 'This is a members-only video. Only channel members can access this content.';
    } else if (error.message.includes('geo')) {
      userMessage = 'This video is not available in your region.';
    } else if (error.message.includes('cookies')) {
      userMessage = 'YouTube requires browser cookies. Please open YouTube in your browser first, then try again.';
    }

    res.status(400).json({ error: userMessage });
  }
});

// GET /api/video-download?url=...&quality=...&platform=...
router.get('/video-download', async (req, res) => {
  const { url, quality } = req.query;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Please provide a valid URL.' });
  }

  const platform = detectPlatform(url);
  if (!platform) {
    return res.status(400).json({
      error: 'Unsupported URL. Please provide a YouTube, Facebook, Instagram, or X (Twitter) video link.'
    });
  }

  const visitorId = req.visitorId || 'unknown';

  // Create download record
  let record;
  try {
    record = await DownloadRecord.create({
      visitorId,
      platform,
      url,
      quality: quality || 'best',
      status: 'pending'
    });
  } catch (err) {
    console.error('Failed to create download record:', err.message);
  }

  try {
    const ytDlpPath = findYtDlpPath();
    if (!ytDlpPath) {
      if (record) {
        await DownloadRecord.findByIdAndUpdate(record._id, {
          status: 'failed',
          errorMessage: 'yt-dlp not found'
        });
      }
      return res.status(500).json({
        error: 'Video download service is not configured. Please contact the administrator.'
      });
    }

    // Generate unique filename to prevent conflicts
    const timestamp = Date.now();
    // Use a simple filename to avoid Windows path length limits and special chars
    const outputTemplate = path.join(downloadsDir, `${timestamp}.%(ext)s`);
    const finalPath = path.join(downloadsDir, `${timestamp}.mp4`);

    await downloadVideo(url, outputTemplate, quality, ytDlpPath);

    // Find the actual output file (yt-dlp expands the template)
    let downloadedFile = finalPath;
    if (!fs.existsSync(finalPath)) {
      // Look for any file starting with the timestamp
      const files = fs.readdirSync(downloadsDir).filter(f => f.startsWith(`${timestamp}`));
      if (files.length > 0) {
        downloadedFile = path.join(downloadsDir, files[0]);
      }
    }

    if (!fs.existsSync(downloadedFile)) {
      throw new Error('Downloaded file not found');
    }

    // Get the actual video title for the filename
    const videoTitle = record?.videoTitle || 'video';
    const safeTitle = videoTitle.replace(/[<>:"/\\|?*]+/g, '').substring(0, 80);

    // Update record
    if (record) {
      await DownloadRecord.findByIdAndUpdate(record._id, {
        status: 'success',
        videoTitle
      });
    }

    // Send file and clean up after
    res.download(downloadedFile, `${safeTitle}.mp4`, (err) => {
      // Always clean up the downloaded file
      safeDelete(downloadedFile);
      if (err && !res.headersSent) {
        console.error('File send error:', err);
      }
    });
  } catch (error) {
    console.error('Download error:', error.message);

    // Update record as failed
    if (record) {
      DownloadRecord.findByIdAndUpdate(record._id, {
        status: 'failed',
        errorMessage: error.message
      }).catch(() => {});
    }

    let userMessage = 'Failed to download video.';
    if (error.message.includes('timed out')) {
      userMessage = 'Download timed out. The file may be too large or the connection is slow.';
    } else if (error.message.includes('File has already been downloaded')) {
      userMessage = 'This video was already downloaded recently. Please try again later.';
    } else if (error.message.includes('ffmpeg')) {
      userMessage = 'Error processing the video. Please try a different quality.';
    } else if (error.message.includes('Video unavailable')) {
      userMessage = 'This video is unavailable or has been removed.';
    } else if (error.message.includes('Sign in') && error.message.includes('bot')) {
      userMessage = 'YouTube is blocking this request. Try opening the video in your browser first, then try again.';
    } else if (error.message.includes('Sign in')) {
      userMessage = 'This video requires login and cannot be downloaded automatically.';
    } else if (error.message.includes('members-only') || error.message.includes('members only')) {
      userMessage = 'This is a members-only video. Only channel members can access this content.';
    } else if (error.message.includes('cookies')) {
      userMessage = 'YouTube requires browser cookies. Please open YouTube in your browser first, then try again.';
    }

    if (!res.headersSent) {
      res.status(400).json({ error: userMessage });
    }
  }
});

module.exports = router;
