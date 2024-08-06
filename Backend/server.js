const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
const cors = require('cors');
const ytdl = require('ytdl-core');
const { exec, spawn } = require('child_process');
const fs = require('fs');

app.use(express.json());
app.use(cors());

const getResu = (formats) => {
  let resuArray = [];

  for (let i = 0; i < formats.length; i++) {
    if (formats[i].qualityLabel !== null) {
      resuArray.push(formats[i]);
    }
  }
  return [...new Set(resuArray.map(v => v.height))];
};

app.get('/api/get-video-info/:id', async (req, res) => {
  const { id } = req.params;
  const { videoDetails, formats } = await ytdl.getInfo(id);
  const { title, thumbnails } = videoDetails;
  const videoResu = getResu(formats);

  return res.status(200).json({
    videoInfo: {
      title,
      thumbnailUrl: thumbnails[thumbnails.length - 1].url,
      videoResu,
      lastResu: videoResu[0]
    }
  });
});

app.get('/api/video-download2', (req, res) => {
  const videoURL = req.query.url;
  const quality = req.query.quality;

  console.log(`Downloading video from URL: ${videoURL} with quality: ${quality}`);

  const ytDlpPath = 'C:\\Users\\Admin\\AppData\\Local\\Programs\\Python\\Python312\\Scripts\\yt-dlp.exe';
  const args = [
    '-f',`bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]`, 
    '-o', '-', 
    videoURL
  ];

  const process = spawn(ytDlpPath, args);

  // Set headers only once
  res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
  res.setHeader('Content-Type', 'video/mp4');

  process.stdout.on('data', (data) => {
    res.write(data);
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on('close', (code) => {
    if (code !== 0) {
      console.error(`Process exited with code ${code}`);
      if (!res.headersSent) {
        res.status(500).send('Error downloading video');
      }
    } else {
      res.end();
    }
  });

  process.on('error', (err) => {
    console.error(`Process error: ${err.message}`);
    if (!res.headersSent) {
      res.status(500).send('Error processing video download');
    }
  });
});

app.get('/', (req, res) => {
  res.send('Start');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// 'C:\\Users\\Admin\\AppData\\Local\\Programs\\Python\\Python312\\Scripts\\yt-dlp.exe'