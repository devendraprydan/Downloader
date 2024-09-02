const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 6000;

app.use(express.json());
app.use(cors());

app.get('/api/get-instagram-video-info', async (req, res) => {
  const videoURL = req.query.url;
  try {
    // Here you would use a service or library to extract video info from Instagram
    const videoInfo = await fetchInstagramVideoInfo(videoURL);
    res.status(200).json({ videoInfo });
  } catch (error) {
    console.error('Error getting Instagram video info:', error);
    res.status(500).json({ error: 'Failed to get Instagram video info' });
  }
});

app.get('/api/instagram-video-download', async (req, res) => {
  const videoURL = req.query.url;
  try {
    const videoStream = await downloadInstagramVideo(videoURL);
    res.setHeader('Content-Disposition', 'attachment; filename="instagram_video.mp4"');
    videoStream.pipe(res);
  } catch (error) {
    console.error('Error downloading Instagram video:', error);
    res.status(500).send('Error downloading video');
  }
});

app.listen(port, () => {
  console.log(`Instagram Downloader backend running on port ${port}`);
});

// Helper functions would go here, using a library or scraping technique to fetch and download Instagram videos.
